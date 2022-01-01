import {useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'

import type {PaletteConfig} from '~/types/palette'
import {requestToPalettes} from '~/lib/responses'
import {Block} from '~/components/PortableText'
import {getSanityData} from '~/lib/sanity'
import Generator from '~/components/Generator'

export const loader: LoaderFunction = async ({request}) => {
  const palettes = requestToPalettes(request.url)
  const about = await getSanityData()

  return {palettes, about}
}

export default function Index() {
  // TODO: Pull from local storage if no query string provided (and override random)
  const data = useLoaderData()
  const {palettes, about}: {palettes: PaletteConfig[]; about: Block[]} = data ?? {}

  return palettes?.length ? <Generator palettes={palettes} about={about} /> : null
}
