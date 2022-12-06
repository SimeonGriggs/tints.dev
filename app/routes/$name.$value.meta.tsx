import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import MetaImage from '~/components/MetaImage'
import {META} from '~/lib/constants'
import {isHex, isValidName, removeTrailingSlash} from '~/lib/helpers'
import {createPaletteFromNameValue} from '~/lib/responses'
import type {PaletteConfig} from '~/types/palette'

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
