"use client";

import { Badge } from "@/components/ui/badge";
import { Address, Order } from "@/lib/models/order";
import { ColumnDef } from "@tanstack/react-table";

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "address",
    header: "Indirizzo",
    cell: ({ row }) => {
      const street = (row.getValue("address") as Address).street as string;
      const number = (row.getValue("address") as Address).number as string;
      const city = (row.getValue("address") as Address).city as string;
      const zipCode = (row.getValue("address") as Address).zipCode as string;
      const province = (row.getValue("address") as Address).province as string;
      const state = (row.getValue("address") as Address).state as string;

      return (
        <p>{`${street} ${number}, ${city}, ${zipCode}, ${province}, ${state}`}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Stato",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];

      if (status === "created") {
        return <Badge className="bg-blue-400">Creato</Badge>;
      } else if (status === "in payment") {
        return <Badge className="bg-orange-300">In Pagamento</Badge>;
      } else if (status === "paid") {
        return <Badge className="bg-green-500">Pagato</Badge>;
      } else {
        return <Badge className="bg-gray-800">Spedito</Badge>;
      }
    },
  },
];
