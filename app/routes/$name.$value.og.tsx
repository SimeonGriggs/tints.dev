import { generateOGImage } from "~/lib/generateOGImage.server";
import { isHex, isValidName, removeTrailingSlash } from "~/lib/helpers";
import { createPaletteFromNameValue } from "~/lib/responses";

import type { Route } from "./+types/$name.$value.og";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  if (
    !params?.name ||
    !isValidName(params?.name) ||
    !params?.value ||
    !isHex(params?.value)
  ) {
    throw new Response(`Not Found`, {
      status: 404,
    });
  }

  const { origin } = new URL(request.url);

  const palette = createPaletteFromNameValue(params.name, params.value);

  if (!palette) {
    throw new Response(`Bad request`, {
      status: 400,
    });
  }

  const canonical = removeTrailingSlash(
    [origin, params.name, params.value.toUpperCase()].join("/")
  );

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
