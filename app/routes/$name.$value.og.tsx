import { generateOGImage } from "~/lib/generateOGImage.server";
import { createPaletteFromNameValue } from "~/lib/responses";

import type { Route } from "./+types/$name.$value.og";

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  if (!params?.name || !params?.value) {
    throw new Response(`Not Found`, {
      status: 404,
    });
  }

  const palette = createPaletteFromNameValue(params.name, params.value);

  if (!palette) {
    throw new Response(`Bad request`, {
      status: 400,
    });
  }

  const png = await generateOGImage([palette], context.cloudflare.env.ASSETS);

  return new Response(new Blob([new Uint8Array(png)]), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "cache-control":
        process.env.NODE_ENV !== "production"
          ? "public, immutable, no-transform, max-age=31536000"
          : "no-cache",
    },
  });
};
