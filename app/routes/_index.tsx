import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import Generator from '~/components/Generator'
import {getGitHubData} from '~/lib/getGitHubData'
import {getSanityData} from '~/lib/getSanityData'
import {createCanonicalUrl, createPaletteMetaImageUrl, requestToPalettes} from '~/lib/responses'

export const meta: MetaFunction = ({data}: {data: any}) => {
  if (!data) {
    return []
  }

  const {palettes} = data

  if (!palettes.length) {
    return []
  }

  const {url, width, height} = createPaletteMetaImageUrl(palettes[0])
  const canonicalUrl = createCanonicalUrl(palettes)

  return [
    {name: 'og:url', content: canonicalUrl},
    {name: 'og:image:width', content: String(width)},
    {name: 'og:image:height', content: String(height)},
    {name: 'og:image', content: url},
  ]
}

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const palettes = requestToPalettes(request.url)
  const [about, github] = await Promise.all([getSanityData(), getGitHubData()])

  return json({
    palettes,
    about,
    stars: github?.stargazers_count ? Number(github.stargazers_count) : 0,
  })
}

export default function Index() {
  const {palettes, about, stars} = useLoaderData<typeof loader>()

  return palettes?.length ? <Generator palettes={palettes} about={about} stars={stars} /> : null
}
