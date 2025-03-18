"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  car: string | undefined;
  status: string | undefined;
}

export function CarPartTable<TData, TValue>({
  car,
  status,
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterType, setFilterType] = useState<"name" | "category" | "status">(
    status ? "status" : "name"
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    if (status) {
      table.getColumn("status")?.setFilterValue(status);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={filterType}
            onValueChange={(value) => {
              setFilterType(value as "name" | "category" | "status");
              setColumnFilters([]);
            }}
          >
            <SelectTrigger className="min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Prodotto</SelectItem>
                <SelectItem value="category">Categoria</SelectItem>
                <SelectItem value="status">Stato</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {(filterType === "name" || filterType === "category") && (
            <Input
              placeholder={
                filterType === "name"
                  ? "Filtra per prodotto..."
                  : "Filtra per categoria..."
              }
              value={
                (table.getColumn(filterType)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(filterType)?.setFilterValue(event.target.value)
              }
              className="min-w-[300px]"
            ></Input>
          )}
          {filterType === "status" && (
            <Select
              value={
                (table.getColumn(filterType)?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) => {
                table.getColumn(filterType)?.setFilterValue(value);
              }}
            >
              <SelectTrigger className="min-w-[160px]">
                {(table.getColumn(filterType)?.getFilterValue() as string) ? (
                  <SelectValue />
                ) : (
                  <p>Filtra per stato...</p>
                )}
                <SelectValue defaultValue={"Filtra per stato..."} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="available">Disponibile</SelectItem>
                  <SelectItem value="pending payment">In Pagamento</SelectItem>
                  <SelectItem value="sold">Venduto</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {car && (
            <div className="relative">
              <Badge className="relative">{car}</Badge>
              <CircleX
                onClick={() => {
                  setFilterType("name");
                  setColumnFilters([]);
                  router.push("/car-parts");
                }}
                className="absolute top-[-4px] right-[-8px] bg-white rounded-full size-4 cursor-pointer"
              ></CircleX>
            </div>
          )}
        </div>
        <Button onClick={() => router.push("/car-parts/new")}>Aggiungi</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nessun componente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
