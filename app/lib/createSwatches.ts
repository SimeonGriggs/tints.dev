import chroma from 'chroma-js'

import {round} from './helpers'
import {PaletteConfig} from '~/types/palette'
import {DEFAULT_PALETTE_CONFIG, DEFAULT_STOPS} from '~/lib/constants'

export function createSwatches(palette: PaletteConfig) {
  const {value} = palette

  // Tweaks may be passed in, otherwise use defaults
  const useLightness = palette.useLightness ?? DEFAULT_PALETTE_CONFIG.useLightness
  const h = palette.h ?? DEFAULT_PALETTE_CONFIG.h
  const s = palette.s ?? DEFAULT_PALETTE_CONFIG.s
  const lMin = palette.lMin ?? DEFAULT_PALETTE_CONFIG.lMin
  const lMax = palette.lMax ?? DEFAULT_PALETTE_CONFIG.lMax

  const valueLightest = chroma(value)
    .set(useLightness ? `hsl.l` : `lch.l`, useLightness ? lMax / 100 : 100)
    .hex()
  const valueDarkest = chroma(value)
    .set(useLightness ? `hsl.l` : `lch.l`, useLightness ? lMin / 100 : 0)
    .hex()

  // console.log(chroma('red').set(`lch.l`, 0).lch())
  // console.log(lMax, chroma(valueLightest).get(`lch.l`), lMin, chroma(valueDarkest).get(`lch.l`))
  const scale = chroma.scale([valueLightest, value, valueDarkest]).domain([0, 1000])

  const swatches = DEFAULT_STOPS.map((stop) => {
    const sScale = Math.abs((stop - 500) / 100) * s
    const hScale = Math.abs((stop - 500) / 100) * h
    const newHex = scale(stop)
      .set(`hsl.s`, `*${sScale / 100}`)
      .set(`hsl.h`, `*${hScale / 100}`)
      .hex()

    console.log(sScale)

    const newL = useLightness ? chroma(newHex).get(`hsl.l`) * 100 : chroma(newHex).get(`lch.l`)

    return {
      // Used for palette
      stop,
      hex: newHex,
      // Used in graphs
      h,
      hScale,
      s,
      sScale,
      l: round(newL, 2),
    }
  })

  console.log(swatches.map((sw) => sw.hScale))

  return swatches
}
