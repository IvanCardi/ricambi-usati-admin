"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import DiscountPopover from "./discount-popover";

export type PrivateCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type CompanyCustomer = {
  id: string;
  name: string;
  email: string;
  vat: string;
  pec: string;
  sdi: string;
  isAutomotive: boolean;
  discount: number;
};

export const companyCustomerColumns: ColumnDef<CompanyCustomer>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "vat",
    header: "P. Iva",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "pec",
    header: "PEC",
  },
  {
    accessorKey: "sdi",
    header: "Codice SDI",
  },
  {
    accessorKey: "isAutomotive",
    header: "Tipologia",
    cell: ({ row }) => {
      const isAutomotive = row.getValue("isAutomotive") as boolean;

      if (isAutomotive) {
        return <Badge className="bg-green-500">Automotive</Badge>;
      } else {
        return <Badge className="bg-orange-300">Generica</Badge>;
      }
    },
  },
  {
    accessorKey: "discount",
    header: "Sconto",
    cell: ({ row }) => {
      const id = row.original.id;
      const isAutomotive = row.original.isAutomotive;
      const discount = row.getValue("discount") as number;

      return (
        <div className="flex gap-2 items-center">
          <p>{discount} %</p>
          {isAutomotive && (
            <DiscountPopover
              customerId={id}
              initialValue={discount}
            ></DiscountPopover>
          )}
        </div>
      );
    },
  },
];

export const privateCustomerColumns: ColumnDef<PrivateCustomer>[] = [
  {
    accessorKey: "firstName",
    header: "Nome",
  },
  {
    accessorKey: "lastName",
    header: "Cognome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
