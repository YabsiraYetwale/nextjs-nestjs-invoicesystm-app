import React from "react";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Goup from "@/components/customers/Goup";
import Invoices from "@/components/invoices/Invoices";
import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";

export default function InvoicesPage() {
 

  return (
    <>
    <ProtectedRoute>
      <div className="flex flex-col justify-evenly">
        <div className="flex sm:gap-[9rem] gap-[15rem]">
          <PageTitle title='Invoices' />
          <Button className="bg-blue-600 hover:bg-blue-500 w-[100px] h-[35px] relative top-[4px] left-[-90px]">
            <Link href={`/dashboard/invoices/addInvoice`}>Add New</Link>
          </Button>
        </div>
        <Invoices/>
      </div>
      <Goup />
    </ProtectedRoute>
    </>
  );
}
