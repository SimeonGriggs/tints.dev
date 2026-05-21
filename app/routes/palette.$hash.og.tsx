import { generateOGImage } from "~/lib/generateOGImage.server";
import { deserializePalette } from "~/lib/paletteHash";

import type { Route } from "./+types/palette.$hash.og";

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  if (!params?.hash) {
    throw new Response(`Not Found`, {
      status: 404,
    });
  }

  const palette = deserializePalette(params.hash);

  if (!palette) {
    throw new Response(`Bad request`, {
      status: 400,
    });
  }

  const png = await generateOGImage([palette], context.cloudflare.env.ASSETS);

  return new Response(new Blob([png]), {
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
