"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Car = {
  id: string;
  brand: string;
  model: string;
  setup: string;
  year: number;
  plate: string;
  totalParts: string;
  soldParts: string;
};

export const carColumns: ColumnDef<Car>[] = [
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "model",
    header: "Modello",
  },
  {
    accessorKey: "setup",
    header: "Allestimento",
  },
  {
    accessorKey: "year",
    header: "Anno",
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
