import { CarPart } from "@/lib/models/carPart";
import { PageProps } from "@/lib/pageProps";
import CarPartCard from "./car-part-card";

async function getCarPart(id: string): Promise<CarPart> {
  const carPart = await fetch(`${process.env.BE_BASE_URL}/carParts/${id}`);

  return (await carPart.json()) as CarPart;
}

export default async function SingleCarPart({ params }: PageProps) {
  const { id } = await params;

  const part = await getCarPart(id);

  return (
    <div className="p-10">
      <CarPartCard part={part}></CarPartCard>
    </div>
  );
}
