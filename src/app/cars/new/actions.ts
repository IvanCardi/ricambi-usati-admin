"use server";

import { ServerActionResponse } from "@/lib/serverActionResponse";

export async function createCar(data: {
  brand: string;
  model: string;
  setup: string;
  year: number;
  plate: string;
  kilometers: number;
  description: string;
}): Promise<ServerActionResponse> {
  try {
    const result = await fetch(`${process.env.BE_BASE_URL}/cars`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.status !== 201) {
      return {
        status: "error",
        message: getMessageForErrorCode((await result.json()).message),
      };
    }

    return { status: "ok" };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { status: "error", message: "" };
  }
}

function getMessageForErrorCode(code: string): string {
  if (code === "DuplicatedCar") {
    return "La macchina è già stata inserita";
  }

  throw new Error("invalid error code");
}
