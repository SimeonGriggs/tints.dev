import {useLoaderData} from 'remix'
import type {LoaderFunction, MetaFunction} from 'remix'

import {createCanonicalUrl, createPaletteMetaImageUrl, requestToPalettes} from '~/lib/responses'
import type {PaletteConfig} from '~/types/palette'
import {Block} from '~/components/PortableText'
import {getSanityData} from '~/lib/sanity'
import Generator from '~/components/Generator'

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
  // const about = await getSanityData()
  const about = []

  return {palettes, about}
}

export default function Index() {
  const data = useLoaderData()
  const {palettes, about}: {palettes: PaletteConfig[]; about: Block[]} = data ?? {}

  return palettes?.length ? <Generator palettes={palettes} about={about} /> : null
}
