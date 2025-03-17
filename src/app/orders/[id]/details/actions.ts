"use server";

import { ServerActionResponse } from "@/lib/serverActionResponse";

export async function markAsShipped(
  orderId: string
): Promise<ServerActionResponse> {
  try {
    const response = await fetch(
      `${process.env.BE_BASE_URL}/orders/${orderId}/shipped`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      return { status: "error", message: "" };
    }

    return { status: "ok" };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { status: "error", message: "" };
  }
}
