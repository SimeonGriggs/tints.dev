import { data } from "react-router";

import { output, requestToPalettes } from "~/lib/responses";

import type { Route } from "./+types/api._index";

export const loader = ({ request }: Route.LoaderArgs) => {
  const palettes = requestToPalettes(request.url);
  const responseString = JSON.stringify(output(palettes));

  return data(responseString, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-content-type-options": "nosniff",
      "Cache-Control": "max-age=604800, s-maxage=604800",
    },
  });
};
