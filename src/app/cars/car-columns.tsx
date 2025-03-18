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
        <div className="flex gap-1 items-center">
          <p>Macchina</p>
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
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <div className="flex gap-1 items-center">
          <p>Anno</p>
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
    accessorKey: "plate",
    header: "Targa",
  },
  {
    accessorKey: "parts",
    accessorFn: (row) => ({
      id: row.id,
      totalParts: row.totalParts,
      soldParts: row.soldParts,
    }),
    header: "Componenti In Vendita",
    cell: ({ row }) => {
      const { id, totalParts, soldParts } = row.getValue("parts") as {
        id: string;
        totalParts: number;
        soldParts: number;
      };

      return (
        <a
          className="hover:underline"
          href={`/car-parts?carId=${id}&status=available`}
        >
          {totalParts - soldParts}
        </a>
      );
    },
  },
  {
    accessorKey: "soldParts",
    accessorFn: (row) => ({
      id: row.id,
      soldParts: row.soldParts,
    }),
    header: "Componenti Venduti",
    cell: ({ row }) => {
      const { id, soldParts } = row.getValue("soldParts") as {
        id: string;
        soldParts: number;
      };

      return (
        <a
          className="hover:underline"
          href={`/car-parts?carId=${id}&status=sold`}
        >
          {soldParts}
        </a>
      );
    },
  },
];
