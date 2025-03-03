import { Car } from "@/lib/models/car";
import { CarPartForm } from "./car-part-form";

const getCars = async (): Promise<Car[]> => {
  const cars = await fetch(`${process.env.BE_BASE_URL}/cars`);

  return (await cars.json()) as Car[];
};

export default async function NewCarPart({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const car = (await searchParams).car as string | undefined;
  const cars = await getCars();

  return (
    <div className="p-10">
      <CarPartForm cars={cars} selectedCarId={car}></CarPartForm>
    </div>
  );
}
