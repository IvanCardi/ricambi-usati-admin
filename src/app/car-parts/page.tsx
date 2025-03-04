import { CarPart } from "@/lib/models/carPart";
import { carPartColumns } from "./car-part-columns";
import { CarPartTable } from "./car-part-table";

const getCarParts = async (): Promise<CarPart[]> => {
  const carParts = await fetch(`${process.env.BE_BASE_URL}/carParts`);

  return (await carParts.json()) as CarPart[];
};

export default async function Cars() {
  const carParts = await getCarParts();

  return (
    <div className="p-10">
      <CarPartTable
        columns={carPartColumns}
        data={carParts.map((cp) => ({
          id: cp.id,
          name: cp.name,
          category: cp.category,
          price: cp.price,
          status: cp.status,
          lastUpdated: cp.lastUpdated,
        }))}
      ></CarPartTable>
    </div>
  );
}
