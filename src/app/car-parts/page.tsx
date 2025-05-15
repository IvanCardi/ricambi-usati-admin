import { CarPart } from "@/lib/models/carPart";
import { carPartColumns } from "./car-part-columns";
import { CarPartTable } from "./car-part-table";
import { Car } from "@/lib/models/car";
import { PageProps } from "@/lib/pageProps";

const getCarParts = async (carId: string | undefined): Promise<CarPart[]> => {
  const params = new URLSearchParams();

  if (carId) {
    params.set("carId", carId);
  }

  const carParts = await fetch(
    `${process.env.BE_BASE_URL}/carParts?${params.toString()}`
  );

  return (await carParts.json()) as CarPart[];
};

const getCar = async (id: string | undefined): Promise<Car> => {
  const car = await fetch(`${process.env.BE_BASE_URL}/cars/${id}`);

  return (await car.json()) as Car;
};

export default async function Cars({ searchParams }: PageProps) {
  const { carId, status } = await searchParams;

  const carParts = await getCarParts(carId as string | undefined);

  let car: Car | undefined;

  if (carId) {
    car = await getCar(carId as string);
  }

  return (
    <div className="p-10">
      <CarPartTable
        car={
          car
            ? `${car.brand} ${car.model} ${car.setup} ${car.year} - ${car.plate}`
            : undefined
        }
        status={status as string | undefined}
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
