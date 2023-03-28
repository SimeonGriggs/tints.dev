import type {PaletteConfig} from '~/types/palette'

export const DEFAULT_STOPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000]

export const DEFAULT_PALETTE_CONFIG: PaletteConfig = {
  id: ``,
  name: ``,
  value: ``,
  valueStop: 200,
  swatches: [],
  h: 0,
  s: 0,
  lMin: 0,
  lMax: 100,
  useLightness: true,
}

export const RANDOM_PALETTES = [
  {
    name: `blue`,
    value: `3B82F6`,
  },
  {
    name: `red`,
    value: `EF4444`,
  },
  {
    name: `green`,
    value: `22C55E`,
  },
  {
    name: `purple`,
    value: `A855F7`,
  },
  // {
  //   name: `yellow`,
  //   value: `EAB308`,
  // },
  {
    name: `brand`,
    value: `2522FC`,
  },
]

export const META = {
  origin: `https://tints.dev`,
  title: `Tailwind CSS 11-color Palette Generator and API`,
  description: `A fast and flexible, HSL-tweakable palette generator and API for Tailwind CSS`,
}

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
