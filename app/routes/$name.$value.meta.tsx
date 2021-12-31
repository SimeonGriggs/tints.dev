import {useLoaderData} from 'remix'
import type {MetaFunction, LoaderFunction} from 'remix'

import type {PaletteConfig} from '~/types/palette'
import {createPaletteFromNameValue} from '~/lib/responses'
import {isHex, isValidName, removeTrailingSlash} from '~/lib/helpers'
import {META} from '~/lib/constants'
import MetaImage from '~/components/MetaImage'

export const meta: MetaFunction = ({data}: {data: any}) => {
  const {canonical} = data

  return {
    'og:url': canonical,
  }
}

export const loader: LoaderFunction = ({params}) => {
  if (!params?.name || !isValidName(params?.name) || !params?.value || !isHex(params?.value)) {
    throw new Response(`Not Found`, {
      status: 404,
    })
  }

  const palette = createPaletteFromNameValue(params.name, params.value)
  const canonical = removeTrailingSlash(
    [META.origin, params.name, params.value.toUpperCase()].join('/')
  )

  return {palettes: [palette], canonical}
}

export default function Index() {
  const {palettes, canonical}: {palettes: PaletteConfig[]; canonical: string} = useLoaderData()

  return <MetaImage palettes={palettes} canonical={canonical} />
}
