"use server";

import { ServerActionResponse } from "@/lib/serverActionResponse";

export async function updateCarPart(
  id: string,
  data: {
    name: string;
    description: string;
    numbers: string[];
    price: number;
    warranty: number;
    photos: string[];
    compatibleCars: string[];
    category: string;
  }
): Promise<ServerActionResponse> {
  try {
    const result = await fetch(`${process.env.BE_BASE_URL}/carParts/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.status !== 200) {
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
