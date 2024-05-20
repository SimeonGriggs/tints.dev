import chroma from 'chroma-js'

import type {Mode} from '~/types'

import {isHex, round} from './helpers'

export function createDisplayColor(
  color: string,
  mode?: Mode,
  alphaPlaceholder?: boolean,
): string | null {
  if (!color || !isHex(color)) {
    return null
  }

  let display = null

  if (!mode || mode === `hex`) {
    display = color.toUpperCase()
  } else if (mode === `p-3`) {
    const [r, g, b] = chroma(color).rgb()

    display = `color(${[
      `display-p3`,
      round(r / 255, 3),
      round(g / 255, 3),
      round(b / 255, 3),
      `/`,
      alphaPlaceholder ? `<alpha-value>` : 1,
    ].join(` `)})`
  } else if (mode === `oklch`) {
    const [l, c, h] = chroma(color).oklch()
    display = `oklch(${[
      round(l * 100, 2) + `%`,
      round(c, 3),
      round(h, 2),
      `/`,
      alphaPlaceholder ? `<alpha-value>` : 1,
    ].join(` `)})`
  }

  return display
}
