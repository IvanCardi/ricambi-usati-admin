"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Car = {
  id: string;
  name: string;
  year: number;
  plate: string;
  totalParts: string;
  soldParts: string;
};

export const carColumns: ColumnDef<Car>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Macchina
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Anno
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "plate",
    header: "Targa",
  },
  {
    accessorKey: "totalParts",
    header: "Componenti Totali",
  },
  {
    accessorKey: "soldParts",
    header: "Componenti Venduti",
  },
];
