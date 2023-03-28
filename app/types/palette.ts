import type {SwatchValue} from './SwatchValue'

export interface PaletteConfig {
  id: string
  name: string
  value: string
  valueStop: number
  swatches: SwatchValue[]
  useLightness: boolean
  h: number
  s: number
  lMin: number
  lMax: number
}
