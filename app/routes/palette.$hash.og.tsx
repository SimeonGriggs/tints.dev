import { generateOGImage } from "~/lib/generateOGImage.server";
import { deserializePalette } from "~/lib/paletteHash";

import type { Route } from "./+types/palette.$hash.og";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  if (!params?.hash) {
    throw new Response(`Not Found`, {
      status: 404,
    });
  }

  const { origin } = new URL(request.url);
  const palette = deserializePalette(params.hash);

  if (!palette) {
    throw new Response(`Bad request`, {
      status: 400,
    });
  }

  const canonical = `${origin}/palette/${params.hash}`;
  const png = await generateOGImage([palette], origin, canonical);

  return new Response(png, {
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
