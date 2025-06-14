import { isHex, isValidName } from "~/lib/helpers";
import {
  createPaletteFromNameValue,
  createRedirectResponse,
} from "~/lib/responses";

import type { Route } from "./+types/api.$name.$value";

export const loader = ({ params, request }: Route.LoaderArgs) => {
  if (
    !params?.name ||
    !isValidName(params.name) ||
    !params?.value ||
    !isHex(params.value)
  ) {
    throw new Response(`Not Found`, {
      status: 404,
    });
  }

  const palette = createPaletteFromNameValue(params.name, params.value);

  if (!palette) {
    throw new Response(`Not Found`, {
      status: 404,
    });
  }

  // Redirect to the new hash-based URL
  return createRedirectResponse(request, palette);
};
