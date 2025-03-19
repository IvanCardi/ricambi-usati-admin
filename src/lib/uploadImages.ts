import { ServerActionResponse } from "./serverActionResponse";

export async function uploadImages(
  images: File[]
): Promise<ServerActionResponse> {
  try {
    const formData = new FormData();

    for (const image of images) {
      formData.append("images", image);
    }

    const imagesResponse = await fetch(`${process.env.BE_BASE_URL}/images`, {
      method: "POST",
      body: formData,
    });

    if (imagesResponse.status !== 200) {
      return {
        status: "error",
        message: "Caricamento immagini non riuscito",
      };
    }

    return {
      status: "ok",
      data: {
        paths: (await imagesResponse.json()).paths,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return { status: "error", message: "Caricamento immagini non riuscito" };
  }
}
