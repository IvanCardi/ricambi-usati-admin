"use server";

export async function createCarPart(data: {
  carId: string;
  name: string;
  description: string;
  numbers: string[];
  price: number;
  warranty: number;
  photos: File[];
  compatibleCars: string[];
  category: string;
}): Promise<{ status: "ok" } | { status: "error"; message: string }> {
  try {
    const result = await fetch(`${process.env.BE_BASE_URL}/carParts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ carId: data.carId, parts: [data] }),
    });

    if (result.status !== 201) {
      return {
        status: "error",
        message: (await result.json()).message,
      };
    }

    return { status: "ok" };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { status: "error", message: "" };
  }
}
