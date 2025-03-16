"use server";

import { ServerActionResponse } from "@/lib/serverActionResponse";
import { revalidateTag } from "next/cache";

export async function updateDiscount(
  value: number,
  customerId: string
): Promise<ServerActionResponse> {
  try {
    const response = await fetch(
      `${process.env.BE_BASE_URL}/customers/${customerId}/discount`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discount: value }),
      }
    );

    if (response.status !== 200) {
      return { status: "error", message: "" };
    }

    revalidateTag("customers");

    return { status: "ok" };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { status: "error", message: "" };
  }
}
