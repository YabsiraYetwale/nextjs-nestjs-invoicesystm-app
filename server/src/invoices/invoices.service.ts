import { Injectable, HttpException} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { PrismaService } from 'prisma/prisma.service';
import { ClientsService } from 'src/clients/clients.service';
import { CreateInvoiceDto } from './dto/create-Invoice.dto';
import { UpdateInvoiceDto } from './dto/update-Invoice.dto';
import { User, Company } from '@prisma/client';


interface ValidatedUser extends User {
  company: Company;
}

@Injectable()
export class InvoicesService {
  constructor(private prismaService: PrismaService,private clientsService: ClientsService) {}
  
async getAllInvoices(searchQuery: string, query: Query) {
  let whereCondition = {};
  if (searchQuery) {
    const lowercaseQuery = searchQuery.toLowerCase();
    whereCondition = {
      OR: [
        {
          due_date: {
            contains: lowercaseQuery,
          },
        },
        {
          status: {
            contains: lowercaseQuery,
          },
        },
        {
          invoice_number: {
            contains: lowercaseQuery,
          },
        },
        {
          client_id: {
            contains: lowercaseQuery,
          },
        },
      ],
    };
  }

  const invoices = await this.prismaService.invoices.findMany({
    where: whereCondition,
    include: { line_items: true, client: true,creator: true, },
  });

  if (!searchQuery) {
    return {invoices}
  }

  return invoices.length > 0 ? {invoices} : 'No matching invoices found.';
}
  async getOneInvoice(id: string) {
    const invoice = await this.prismaService.Invoices.findUnique({
      where: id,
      include: { line_items: true, client: true,creator: true,company: true, },
    });
    if (!invoice) {
      throw new HttpException("Invoice doesn't exist", 404);
    } else {
      return { invoice };
    }
  } 

  async getInvoicesByCompanyId(companyId: string) {
    const invoices = await this.prismaService.Invoices.findMany({
      where: {
        company_id: companyId,
      },
    })
    return {invoices};
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto,
     validatedUser: ValidatedUser
     ) {
  const { total_amount, line_items, client, creator, company, ...post } = createInvoiceDto;
  
  const totalAmount = line_items?.reduce((total, item) => {
  const subtotal = item.quantity * item.unit_price;
  const taxAmount = subtotal * 0.15; // Calculate the tax amount

  return total + subtotal + taxAmount; // Add the tax amount to the total
}, 0);

    const lastInvoice = await this.prismaService.Invoices.findFirst({
      orderBy: { invoice_number: 'desc' },
    });
  
    let invoiceNumber = 'INV-001';
    if (lastInvoice && lastInvoice.invoice_number) {
      const lastNumber = parseInt(lastInvoice.invoice_number.split('-')[1]);
      invoiceNumber = `INV-${(lastNumber + 1).toString().padStart(3, '0')}`;
    }
  
    const clientData = {
      name: client?.name,
      billing_address: client?.billing_address,
      shipping_address: client?.shipping_address,
      shipping_city: client?.shipping_city,
      shipping_state: client?.shipping_state,
      shipping_zip: client?.shipping_zip,
      shipping_country: client?.shipping_country,
      contact_person: client?.contact_person,
      email: client?.email,
      phone: client?.phone,
    };
  
    let createdClient: { id: any; };
  
    if (clientData.email) {
      createdClient = await this.prismaService.Clients.findUnique({
        where: {
          email: clientData.email,
        },
      });
  
      if (!createdClient) {
        createdClient = await this.prismaService.Clients.create({
          data: clientData,
        });
      }
    }
  
    const newInvoice = await this.prismaService.Invoices.create({
      data: {
        invoice_number: invoiceNumber,
        total_amount: totalAmount,
        ...post,
        recipient_company:{
          connect: {
            id: createInvoiceDto?.recipient_company?.id,
          },
        },
        client: {
          connect: createdClient ? { id: createdClient.id } : undefined,
        },
        creator: {
          connect: {
            id: validatedUser?.id,
          },
        },
        // company: {
        //   connect: {
        //     id:validatedUser?.company?.id,
        //   },
        // },
        line_items: {
          create: createInvoiceDto.line_items?.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_rate: 0.15,
          })),
        },
      },
      include: {
        line_items: true,
        client: true,
        creator: true,
        company: true,
      },
    });
  
    return newInvoice;
  };
async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto) {
  const { total_amount, client, line_items, ...post } = updateInvoiceDto;
  const existingInvoice = await this.prismaService.Invoices.findUnique({
    where: id,
    include: { line_items: true },
  });
  if (!existingInvoice) {
    throw new HttpException("Invoice doesn't exist", 404)
  }
  
  // Check if line_items are provided in the request
  const lineItemsProvided = line_items && line_items.length > 0;

  // Delete line_items only if line_items are provided in the request
  if (lineItemsProvided) {
    await this.prismaService.Line_Items.deleteMany({
      where: { invoice_id: existingInvoice.id },
    });
  }

  const totalAmount = line_items?.reduce((total, item) => {
    const subtotal = item.quantity * item.unit_price;
    const taxAmount = subtotal * 0.15; // Calculate the tax amount
  
    return total + subtotal + taxAmount; // Add the tax amount to the total
  }, 0);

  const updatedInvoice = await this.prismaService.Invoices.update({
    where: id,
    data: {
      total_amount: totalAmount,
      ...post,
      client: {
        update: {
          name: client?.name,
          billing_address: client?.billing_address,
          shipping_address: client?.shipping_address,
          shipping_city: client?.shipping_city,
          shipping_state: client?.shipping_state,
          shipping_zip: client?.shipping_zip,
          shipping_country: client?.shipping_country,
          contact_person: client?.contact_person,
          email: client?.email,
          phone: client?.phone,
        },
      },
      line_items: lineItemsProvided
        ? {
            create: line_items?.map((item) => ({
              description: item?.description,
              quantity: item?.quantity,
              unit_price: item?.unit_price,
              tax_rate: 0.15,
            })),
          }
        : undefined,
    },
  })

  if (!updatedInvoice) {
    throw new Error('Failed to update Invoice!!!');
  }

  return { ...updatedInvoice };
}
  
  async deleteInvoice(id: string) {
    const existingInvoice = await this.prismaService.Invoices.findUnique({
      where: id,
    });
    if (!existingInvoice) {
      throw new HttpException("Invoice doesn't exist", 404);
    }
    const deletedInvoice = await this.prismaService.Invoices.delete({
      where: id,
    });
    if (!deletedInvoice) {
      throw new Error('Failed to delete Invoice');
    } else {
      return { message: 'Invoice deleted successfully' };
    }
  }
}