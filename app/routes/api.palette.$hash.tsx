import { data } from "react-router";

import { deserializePalette } from "~/lib/paletteHash";
import { output } from "~/lib/responses";
import { MODES } from "~/lib/constants";
import type { Mode } from "~/types";

import type { Route } from "./+types/api.palette.$hash";

export const loader = ({ params, request }: Route.LoaderArgs) => {
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

  const url = new URL(request.url);
  const outputMode: Mode = (url.searchParams.get("output") as Mode) || MODES[0];

  const responseString = JSON.stringify(output([palette], outputMode)).replace(
    / \/ <alpha-value>/g,
    "",
  );

  return data(responseString, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      "Cache-Control": "max-age=604800, s-maxage=604800",
    },
  });
};
