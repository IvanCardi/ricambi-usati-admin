"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Address } from "@/lib/models/order";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import { PartialOrderInfo } from "./page";

export const orderColumns: ColumnDef<PartialOrderInfo>[] = [
  {
    accessorKey: "id",
    header: "Ordine",
    cell: ({ row }) => {
      return (
        <a
          className="hover:underline"
          href={`/orders/${row.getValue("id")}/details`}
        >{`Ordine ${row.index + 1}`}</a>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Stato",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

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
  {
    accessorKey: "totalPrice",
    header: "Totale",
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as number;

      return <p>{`${totalPrice} €`}</p>;
    },
  },
  {
    accessorKey: "address",
    header: "Indirizzo",
    cell: ({ row }) => {
      const streetName = (row.getValue("address") as Address).streetName;
      const streetName2 = (row.getValue("address") as Address).streetName2;
      const city = (row.getValue("address") as Address).city;
      const postalCode = (row.getValue("address") as Address)
        .postalCode as string;
      const province = (row.getValue("address") as Address).province;
      const country = (row.getValue("address") as Address).country;
      const administrativeArea = (row.getValue("address") as Address)
        .administrativeArea;
      const dependentLocality = (row.getValue("address") as Address)
        .dependentLocality;

      return (
        <p>{`${streetName} ${streetName2 ?? ""} ${city ?? ""} ${
          postalCode ?? ""
        } ${province ?? ""} ${dependentLocality ?? ""} ${
          administrativeArea ?? ""
        } ${country}`}</p>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex gap-1 items-center">
          <p>Creato</p>
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatted = moment(date).format("DD/MM/YYYY HH:mm");

      return <div>{formatted}</div>;
    },
  },
];
