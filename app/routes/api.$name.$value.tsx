import { isHex, isValidName } from "~/lib/helpers";
import { createPaletteFromNameValue, output } from "~/lib/responses";

import type { Route } from "./+types/api.$name.$value";

export const loader = ({ params }: Route.LoaderArgs) => {
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

  const responseString = JSON.stringify(output([palette]));

  return new Response(responseString, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      "Cache-Control": "max-age=604800, s-maxage=604800",
    },
  });
};
