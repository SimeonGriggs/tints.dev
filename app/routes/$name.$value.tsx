import { useLoaderData } from "react-router";

import Generator from "~/components/Generator";
import { META } from "~/lib/constants";
import { getGitHubData } from "~/lib/getGitHubData";
import { getSanityData } from "~/lib/getSanityData";
import { isHex, isValidName } from "~/lib/helpers";
import {
  createCanonicalUrl,
  createPaletteFromNameValue,
  createPaletteMetaImageUrl,
} from "~/lib/responses";

import type { Route } from "./+types/$name.$value";

export const meta: Route.MetaFunction = ({ data }: { data: any }) => {
  if (!data) {
    return [];
  }

  const { palettes } = data;

  const { url, width, height } = createPaletteMetaImageUrl(palettes[0]);
  const canonicalUrl = createCanonicalUrl(palettes);

  return [
    { name: "og:url", content: canonicalUrl },
    { name: "og:image:width", content: String(width) },
    { name: "og:image:height", content: String(height) },
    { name: "og:image", content: url },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  if (!params?.name) {
    throw new Response(`No Color Name`, {
      status: 404,
      statusText: `Link structure must be ${META.origin}/:name/:value`,
    });
  } else if (!params?.value) {
    throw new Response(`No Hex Value`, {
      status: 404,
      statusText: `Link structure must be ${META.origin}/:name/:value`,
    });
  } else if (!isValidName(params?.name)) {
    throw new Response(`Invalid Color Name`, {
      status: 406,
      statusText:
        "Color names must only use lower and uppercase letters, between 3-24 characters",
    });
  } else if (!isHex(params?.value)) {
    throw new Response(`Invalid Hex Value`, {
      status: 406,
      statusText:
        "Color must be a valid hexidecimal value, six characters long, without a leading #",
    });
  }

  const palette = createPaletteFromNameValue(params.name, params.value);
  const [about, github] = await Promise.all([getSanityData(), getGitHubData()]);

  return {
    palettes: palette ? [palette] : [],
    about,
    stars: github?.stargazers_count ? Number(github.stargazers_count) : 0,
  };
};

export default function Index() {
  const { palettes, about, stars } = useLoaderData<typeof loader>();

  return palettes?.length ? (
    <Generator palettes={palettes} about={about} stars={stars} />
  ) : null;
}
