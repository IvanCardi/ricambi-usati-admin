import { DataTable } from "@/components/ui/data-table";
import { carColumns } from "./car-columns";

const getCars = async () => {
  const cars = await fetch(`${process.env.BE_BASE_URL}/cars`);

  return await cars.json();
};

export default async function Cars() {
  const cars = await getCars();

  return (
    <div className="p-10">
      <DataTable columns={carColumns} data={cars}></DataTable>
    </div>
  );
}
