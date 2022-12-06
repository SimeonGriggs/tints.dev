import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import Generator from '~/components/Generator'
import type {Block} from '~/components/Prose'
import {createCanonicalUrl, createPaletteMetaImageUrl, requestToPalettes} from '~/lib/responses'
import {getSanityData} from '~/lib/sanity'
import type {PaletteConfig} from '~/types/palette'

export const meta: MetaFunction = ({data}: {data: any}) => {
  if (!data) {
    return {}
  }

  const {palettes} = data

  if (!palettes.length) {
    return {}
  }

  const {url, width, height} = createPaletteMetaImageUrl(palettes[0])
  const canonicalUrl = createCanonicalUrl(palettes)

  return {
    'og:url': canonicalUrl,
    'og:image:width': width,
    'og:image:height': height,
    'og:image': url,
  }
}

export const loader: LoaderFunction = async ({request}) => {
  const palettes = requestToPalettes(request.url)
  const about = await getSanityData()

  return {palettes, about}
}

export default function Index() {
  const data = useLoaderData()
  const {palettes, about}: {palettes: PaletteConfig[]; about: Block[]} = data ?? {}

  return palettes?.length ? <Generator palettes={palettes} about={about} /> : null
}
