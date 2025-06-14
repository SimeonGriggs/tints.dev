import { generateOGImage } from "~/lib/generateOGImage.server";
import { isHex, isValidName, removeTrailingSlash } from "~/lib/helpers";
import {
  createPaletteFromNameValue,
  createRedirectResponse,
} from "~/lib/responses";

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

  const palette = createPaletteFromNameValue(params.name, params.value);

  if (!palette) {
    throw new Response(`Bad request`, {
      status: 400,
    });
  }

  // Redirect to the new hash-based URL
  return createRedirectResponse(request, palette);
};
