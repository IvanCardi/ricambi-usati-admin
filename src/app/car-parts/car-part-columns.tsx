"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import CarPartStatusBadge from "./car-part-status-badge";

export type CarPart = {
  id: string;
  name: string;
  category: string;
  status: "available" | "pending payment" | "sold";
  price: number;
  lastUpdated: string;
};

export const carPartColumns: ColumnDef<CarPart>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => {
      return {
        id: row.id,
        name: row.name,
      };
    },
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
    cell: ({ row }) => {
      const { id, name } = row.getValue("name") as { id: string; name: string };

      return <Link href={`/car-parts/${id}`}>{name}</Link>;
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
      const status = row.getValue("status") as CarPart["status"];

      return <CarPartStatusBadge status={status}></CarPartStatusBadge>;
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
