import { data } from "react-router";

import { output, requestToPalettes } from "~/lib/responses";
import { MODES } from "~/lib/constants";
import type { Mode } from "~/types";

import type { Route } from "./+types/api._index";

export const loader = ({ request }: Route.LoaderArgs) => {
  const palettes = requestToPalettes(request.url);

  const url = new URL(request.url);
  const outputMode: Mode = (url.searchParams.get("output") as Mode) || MODES[0];

  const responseString = JSON.stringify(output(palettes, outputMode));

  return data(responseString, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      "Cache-Control": "max-age=604800, s-maxage=604800",
    },
  });
};
