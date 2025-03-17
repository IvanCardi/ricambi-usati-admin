"use client";

import { ColumnDef } from "@tanstack/react-table";

export const productColumns: ColumnDef<{
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
}>[] = [
  {
    accessorKey: "name",
    header: "Nome prodotto",
  },
  {
    accessorKey: "price",
    accessorFn: (row) => ({
      price: row.price,
      discountedPrice: row.discountedPrice,
    }),
    header: "Prezzo",
    cell: ({ row }) => {
      const price = row.getValue("price") as {
        price: number;
        discountedPrice: number;
      };

      return (
        <p>
          {price.discountedPrice !== undefined ? (
            <>
              <span className="line-through text-gray-500">{`${price.price} €`}</span>{" "}
              <span>{`${price.discountedPrice} €`}</span>
            </>
          ) : (
            `${price.price} €`
          )}
        </p>
      );
    },
  },
];
