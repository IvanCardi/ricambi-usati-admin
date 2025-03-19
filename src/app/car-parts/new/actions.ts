"use server";

import { ServerActionResponse } from "@/lib/serverActionResponse";
import { uploadImages } from "@/lib/uploadImages";

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
}): Promise<ServerActionResponse> {
  let photos: string[] = [];

  if (data.photos && data.photos.length > 0) {
    const imageLoadResult = await uploadImages(data.photos);

    if (imageLoadResult.status === "error") {
      return imageLoadResult;
    }

    const { paths } = imageLoadResult.data;

    photos = [...data.photos, ...paths];
  }

  try {
    const result = await fetch(`${process.env.BE_BASE_URL}/carParts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carId: data.carId,
        parts: [{ ...data, photos }],
      }),
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
