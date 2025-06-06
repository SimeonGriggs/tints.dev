import { useLoaderData } from "react-router";

import Generator from "~/components/Generator";
import { getGitHubData } from "~/lib/getGitHubData";
import { getSanityData } from "~/lib/getSanityData";
import {
  createCanonicalUrl,
  createPaletteMetaImageUrl,
  requestToPalettes,
} from "~/lib/responses";

import type { Route } from "./+types/_index";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const palettes = requestToPalettes(request.url);
  const [about, github] = await Promise.all([getSanityData(), getGitHubData()]);

  return {
    palettes,
    about,
    stars: github?.stargazers_count ? Number(github.stargazers_count) : 0,
  };
};

export default function Index() {
  const { palettes, about, stars } = useLoaderData<typeof loader>();

  if (!palettes?.length) {
    return null;
  }

  const { url, width, height } = createPaletteMetaImageUrl(palettes[0]);
  const canonicalUrl = createCanonicalUrl(palettes);

  return (
    <>
      <meta name="og:url" content={canonicalUrl} />
      <meta name="og:image:width" content={String(width)} />
      <meta name="og:image:height" content={String(height)} />
      <meta name="og:image" content={url} />
      <Generator palettes={palettes} about={about} stars={stars} />
    </>
  );
}
