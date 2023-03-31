import type {Mode} from '~/types'

import {hexToRGB, isHex, round} from './helpers'

export function createDisplayColor(
  color: string,
  mode?: Mode,
  alphaPlaceholder?: boolean
): string | null {
  if (!color || !isHex(color)) {
    return null
  }

  let display = null

  if (!mode || mode === `hex`) {
    display = color.toUpperCase()
  } else if (mode === `p-3`) {
    const {r, g, b} = hexToRGB(color)

    display = `color(${[
      `display-p3`,
      round(parseInt(r) / 255, 3),
      round(parseInt(g) / 255, 3),
      round(parseInt(b) / 255, 3),
      `/`,
      alphaPlaceholder ? `<alpha-value>` : 1,
    ].join(` `)})`
  }

  return display
}
