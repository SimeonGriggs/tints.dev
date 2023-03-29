import type {Mode} from '~/types'

import {hexToRGB, isHex, round} from './helpers'

export function createDisplayColor(color: string, mode?: Mode): string | null {
  if (!color || !isHex(color)) {
    return null
  }

  let display

  if (!mode || mode === `hex`) {
    display = color.toUpperCase()
  } else if (mode === `p-3`) {
    const {r, g, b} = hexToRGB(color)

    display = `color(display-p3 ${[
      round(parseInt(r) / 255, 3),
      round(parseInt(g) / 255, 3),
      round(parseInt(b) / 255, 3),
    ].join(` `)} / 1)`
  }

  return display || null
}
