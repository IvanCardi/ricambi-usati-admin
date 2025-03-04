"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";

export type CarPart = {
  id: string;
  name: string;
  category: string;
  status: string;
  price: number;
  lastUpdated: string;
};

export const carPartColumns: ColumnDef<CarPart>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex gap-1 items-center">
          <p>Prodotto</p>
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
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <div className="flex gap-1 items-center">
          <p>Categoria</p>
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
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex gap-1 items-center">
          <p>Stato</p>
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      if (status === "available") {
        return <Badge className="bg-green-500">Disponibile</Badge>;
      }

      if (status === "pending payment") {
        return <Badge className="bg-orange-300">In Pagamento</Badge>;
      }

      if (status === "sold") {
        return <Badge className="bg-slate-700">Venduto</Badge>;
      }
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex gap-1 items-center">
          <p>Prezzo</p>
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
      const price = row.getValue("price") as string;

      return <div>{price} €</div>;
    },
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => {
      return (
        <div className="flex gap-1 items-center">
          <p>Ultima Modifica</p>
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
      const date = row.getValue("lastUpdated") as string;
      const formatted = moment(date).format("DD/MM/YYYY HH:mm");

      return <div>{formatted}</div>;
    },
  },
];
