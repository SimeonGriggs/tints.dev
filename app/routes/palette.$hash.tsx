import { useLoaderData } from "react-router";

import Generator from "~/components/Generator";
import { getGitHubData } from "~/lib/getGitHubData";
import { getSanityData } from "~/lib/getSanityData";
import { deserializePalettes } from "~/lib/paletteHash";
import { createCanonicalUrl, createPaletteMetaImageUrl } from "~/lib/responses";

import type { Route } from "./+types/palette.$hash";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
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
  const origin = new URL(request.url).origin;

  return {
    palettes,
    about,
    stars: github?.stargazers_count ? Number(github.stargazers_count) : 0,
    origin,
  };
};

export default function PaletteHash() {
  const { palettes, about, stars, origin } = useLoaderData<typeof loader>();

  if (!palettes?.length) {
    return null;
  }

  const { url, width, height } = createPaletteMetaImageUrl(palettes[0], origin);
  const canonicalUrl = createCanonicalUrl(palettes, false, origin);

  return (
    <>
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image:width" content={String(width)} />
      <meta property="og:image:height" content={String(height)} />
      <meta property="og:image" content={url} />
      <Generator palettes={palettes} about={about} stars={stars} />
    </>
  );
}
