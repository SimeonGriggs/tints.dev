import type {LoaderFunction} from '@remix-run/node'

import {output, requestToPalettes} from '~/lib/responses'

export const loader: LoaderFunction = ({request}) => {
  const palettes = requestToPalettes(request.url)
  const responseString = JSON.stringify(output(palettes))

  return new Response(responseString, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-content-type-options': 'nosniff',
      'Cache-Control': 'max-age=604800, s-maxage=604800',
    },
  })
}
