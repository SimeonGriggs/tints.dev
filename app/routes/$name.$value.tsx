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
import {META} from '~/lib/constants'

export const meta: MetaFunction = ({data}: {data: any}) => {
  if (!data) {
    return {}
  }

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
  if (!params?.name) {
    throw new Response(`No Color Name`, {
      status: 404,
      statusText: `Link structure must be ${META.origin}/:name/:value`,
    })
  } else if (!params?.value) {
    throw new Response(`No Hex Value`, {
      status: 404,
      statusText: `Link structure must be ${META.origin}/:name/:value`,
    })
  } else if (!isValidName(params?.name)) {
    throw new Response(`Invalid Color Name`, {
      status: 406,
      statusText: 'Color names must only use lower and uppercase letters, between 3-24 characters',
    })
  } else if (!isHex(params?.value)) {
    throw new Response(`Invalid Hex Value`, {
      status: 406,
      statusText:
        'Color must be a valid hexidecimal value, six characters long, without a leading #',
    })
  }

  const palette = createPaletteFromNameValue(params.name, params.value)
  const about = await getSanityData()

  return {palettes: [palette], about}
}

export default function Index() {
  const data = useLoaderData()
  const {palettes, about}: {palettes: PaletteConfig[]; about: Block[]} = data ?? {}

  return palettes?.length ? <Generator palettes={palettes} about={about} /> : null
}
