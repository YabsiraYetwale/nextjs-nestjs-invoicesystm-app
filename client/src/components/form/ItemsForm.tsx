'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  invoice_id: z.string().min(1, 'invoice_id is required').max(100),
  items: z.array(
    z.object({
      description: z.string().min(1, 'description is required'),
      unit_price: z.string().min(1, 'unit_price is required'),
      tax_rate: z.string().min(1, 'tax_rate is required'),
    })
  ),
});

const ItemsForm = () => {
  const router = useRouter()
  const [items, setItems] = useState([{}]); 
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      invoice_id: '',
      items: [{}], 
    },
  });

  const { control, handleSubmit } = form;
  const { fields: itemFields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleAddItem = () => {
    append({});
    setItems([...items, {}]);
  };

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log(values);
  };

  return (
    <div className='flex flex-col gap-5 py-7 justify-center items-center'>
      {/* <p className='font-bold text-[30px]'>Add Items</p> */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='w-[80%] flex flex-col gap-5'>
          <FormField
            control={control}
            name='invoice_id'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <select {...field} className="border"> 
                    <option>Choose invoice_id</option>
                    <option>invoice_id1</option>
                    <option>invoice_id2</option>
                    <option>invoice_id3</option>
                    <option>invoice_id4</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {itemFields.map((item, index) => (
            <div key={item.id} className='flex flex-row-reverse gap-1'>
             <div className='flex flex-col gap-5'> 
             <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea className='border solid' placeholder='Enter description' {...field} cols='125' rows='5' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='w-[100%] flex gap-5'>
                
              <FormField
                control={control}
                name={`items.${index}.unit_price`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                   <Input className='w-[32.3vw] flex  gap-5' type='number' placeholder='Enter unit price' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             
              <FormField
                control={control}
                name={`items.${index}.tax_rate`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className='w-[32.3vw] flex  gap-5' type='number' placeholder='Enter tax rate' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              </div>
              <Button type='button' onClick={() => remove(index)}
              className='bg-red-600 hover:bg-red-400 w-[20px] h-[25px] relative top-5'
              >
                X
              </Button>
            </div>
          ))}
          <Button type='button' onClick={handleAddItem}
           className='bg-green-600 hover:bg-green-400 w-[100px] relative top-5'
          >
            Add Item
          </Button>
          <Button className='w-full mt-6' type='submit'>
            Create item
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ItemsForm;