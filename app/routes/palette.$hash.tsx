import { useLoaderData } from "react-router";

import Generator from "~/components/Generator";
import { getGitHubData } from "~/lib/getGitHubData";
import { getSanityData } from "~/lib/getSanityData";
import { deserializePalettes } from "~/lib/paletteHash";

import type { Route } from "./+types/palette.$hash";

export const loader = async ({ params }: Route.LoaderArgs) => {
  if (!params?.hash) {
    throw new Response(`No Hash Provided`, {
      status: 404,
      statusText: `Link structure must be /palette/:hash`,
    });
  }

  const palettes = deserializePalettes(params.hash);

  if (!palettes) {
    throw new Response(`Invalid Hash`, {
      status: 404,
      statusText: `The provided hash is invalid or corrupted`,
    });
  }

  const [about, github] = await Promise.all([getSanityData(), getGitHubData()]);

  return {
    palettes,
    about,
    stars: github?.stargazers_count ? Number(github.stargazers_count) : 0,
  };
};

export default function PaletteHash() {
  const { palettes, about, stars } = useLoaderData<typeof loader>();

  if (!palettes?.length) {
    return null;
  }

  return <Generator palettes={palettes} about={about} stars={stars} />;
}
