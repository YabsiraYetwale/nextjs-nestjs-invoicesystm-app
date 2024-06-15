"use client"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DataTable, ColumnDef } from "@/components/DataTable";
import React from "react";
import PageTitle from "@/components/PageTitle";
import { fetchCustomer } from "@/redux/actions/customers";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {useLocale } from 'next-intl';

type Props = {
  params: any;
};

type Customer = {
  id: string;
  invoices: Invoice[];
};

type Invoice = {
  id: any;
  status: any;
  date?: any;
  due_date?: any;
  invoice_number?: any;
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const date = new Date(dateString);
  const originalDate = date.toLocaleDateString(undefined, options);
  const [day, month, year] = originalDate.split("/");
  return `${year}-${month}-${day}`;
};

type CellProps = {
  row: any;
};

const Cell: React.FC<CellProps> = ({ row }) => {
  const id = row.getValue("id");
  const localActive = useLocale();

  return (
    <div>
      <div className="flex gap-2 items-center">
        <Link
          className="bg-blue-600 px-5 py-2 text-white rounded-[10px]"
          href={`/${localActive}/invoices/details/${id}`}
        >
          {localActive === "en" ? "View" : "ዝርዝር"}
        </Link>
      </div>
    </div>
  );
};




const InvoiceCard = ({ params }: Props) => {
  const [invoice, setInvoice] = useState<Customer | null>(null);
  const dispatch = useDispatch();
  const localActive = useLocale();
  const id = params.id as string;

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoice_number",
      header: (localActive === "en" ? "Invoice Number" : "የኢንቮይስ ቁጥር"),
    },
    {
      accessorKey: "status",
      header: (localActive === "en" ? "Status" : "ሁኔታ"),
      cell: ({ row }: any) => {
        return (
          <div
            className={cn("font-medium w-fit px-4 py-2 rounded-lg", {
              "text-red-600": row.getValue("status") === "unpaid",
              "text-orange-600": row.getValue("status") === "read",
              "text-green-600": row.getValue("status") === "paid",
            })}
          >
            {row.getValue("status")}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: (localActive === "en" ? "Date" : "ቀን"),
      cell: ({ row }: any) => {
        const formattedDate = formatDate(row.getValue("date"));
        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "due_date",
      header: (localActive === "en" ? "Due Date" : "ማስረከቢያ ቀን"),
    },
    {
      accessorKey: "id",
      header:(localActive === "en" ? "Details" : "ዝርዝር"),
      cell: Cell,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch<any>(fetchCustomer(id));
        setInvoice(response);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [dispatch, id]);

  return (
    <div className="flex justify-evenly">
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title="Invoices" />
              {invoice && <DataTable columns={columns} data={invoice.invoices} />}
      </div>
    </div>
  );
};

export default InvoiceCard;