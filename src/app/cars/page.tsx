import { DataTable } from "@/components/ui/data-table";
import { carColumns } from "./car-columns";
import { Car } from "@/lib/models/car";

const getCars = async (): Promise<Car[]> => {
  const cars = await fetch(`${process.env.BE_BASE_URL}/cars`);

  return (await cars.json()) as Car[];
};

export default async function Cars() {
  const cars = await getCars();

  return (
    <div className="p-10">
      <DataTable
        columns={carColumns}
        data={cars.map((c) => ({
          id: c.id,
          name: `${c.brand} ${c.model} ${c.setup}`,
          year: c.year,
          plate: c.plate,
          totalParts: c.totalParts,
          soldParts: c.soldParts,
        }))}
      ></DataTable>
    </div>
  );
}
