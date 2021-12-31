import {useLoaderData} from 'remix'
import type {LoaderFunction, MetaFunction} from 'remix'

import type {PaletteConfig} from '~/types/palette'
import {Block} from '~/components/PortableText'
import {
  createCanonicalUrl,
  createPaletteFromNameValue,
  createPaletteMetaImageUrl,
} from '~/lib/responses'
import {isHex, isValidName} from '~/lib/helpers'
import {getSanityData} from '~/lib/sanity'
import Generator from '~/components/Generator'

export const meta: MetaFunction = ({data}: {data: any}) => {
  const {palettes} = data

  const {url, width, height} = createPaletteMetaImageUrl(palettes[0])
  const canonicalUrl = createCanonicalUrl(palettes)

  return {
    'og:url': canonicalUrl,
    'og:image:width': width,
    'og:image:height': height,
    'og:image': url,
  }
}

export const loader: LoaderFunction = async ({params}) => {
  if (!params?.name || !isValidName(params?.name) || !params?.value || !isHex(params?.value)) {
    throw new Response(`Not Found`, {
      status: 404,
    })
  }

  const palette = createPaletteFromNameValue(params.name, params.value)
  const about = await getSanityData()

  return {palettes: [palette], about}
}

export default function Index() {
  const {palettes, about}: {palettes: PaletteConfig[]; about: Block[]} = useLoaderData()

  return <Generator palettes={palettes} about={about} />
}
