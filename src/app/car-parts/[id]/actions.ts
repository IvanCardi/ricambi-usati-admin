"use server";

import { ServerActionResponse } from "@/lib/serverActionResponse";
import { uploadImages } from "@/lib/uploadImages";
import { revalidateTag } from "next/cache";

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
  },
  newPhotos: File[]
): Promise<ServerActionResponse> {
  let photos = [...data.photos];
  if (newPhotos && newPhotos.length > 0) {
    const imageLoadResult = await uploadImages(newPhotos);

    if (imageLoadResult.status === "error") {
      return imageLoadResult;
    }

    const { paths } = imageLoadResult.data;

    photos = [...photos, ...paths];
  }

  try {
    const result = await fetch(`${process.env.BE_BASE_URL}/carParts/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, photos }),
    });

    if (result.status !== 200) {
      return {
        status: "error",
        message: (await result.json()).message,
      };
    }

    revalidateTag("car-part");

    return { status: "ok" };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { status: "error", message: "" };
  }
}

export async function deleteCarPart(id: string): Promise<ServerActionResponse> {
  try {
    const result = await fetch(`${process.env.BE_BASE_URL}/carParts/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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
