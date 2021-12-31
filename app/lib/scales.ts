import {round} from './helpers'

export function createSaturationScale(tweak: number = 0) {
  return [
    {key: 0, tweak: Math.round(tweak * 1.15)},
    {key: 50, tweak: Math.round(tweak * 1.125)},
    {key: 100, tweak: Math.round(tweak)},
    {key: 200, tweak: Math.round(tweak * 0.75)},
    {key: 300, tweak: Math.round(tweak * 0.5)},
    {key: 400, tweak: Math.round(tweak * 0.25)},
    {key: 500, tweak: 0},
    {key: 600, tweak: Math.round(tweak * 0.25)},
    {key: 700, tweak: Math.round(tweak * 0.5)},
    {key: 800, tweak: Math.round(tweak * 0.75)},
    {key: 900, tweak: Math.round(tweak)},
    {key: 1000, tweak: Math.round(tweak) * 1.25},
  ]
}

export function createHueScale(tweak: number = 0) {
  return [
    {key: 0, tweak: tweak ? tweak * 4 + tweak : 0},
    {key: 50, tweak: tweak ? tweak * 3.5 + tweak : 0},
    {key: 100, tweak: tweak ? tweak * 3 + tweak : 0},
    {key: 200, tweak: tweak ? tweak * 2 + tweak : 0},
    {key: 300, tweak: tweak ? tweak * 1 + tweak : 0},
    {key: 400, tweak: tweak ? tweak + 0 : 0},
    {key: 500, tweak: 0},
    {key: 600, tweak: tweak || 0},
    {key: 700, tweak: tweak ? tweak * 1 + tweak : 0},
    {key: 800, tweak: tweak ? tweak * 2 + tweak : 0},
    {key: 900, tweak: tweak ? tweak * 3 + tweak : 0},
    {key: 1000, tweak: tweak ? tweak * 4 + tweak : 0},
  ]
}

export function createDistributionValues(min: number, max: number, lightness: number) {
  // A `0` swatch (lightest color) would have this lightness
  const maxLightness = max ?? 100
  const maxStep = round((maxLightness - lightness) / 5, 2)

  // A `1000` swatch (darkest color) would have this lightness
  const minLightness = min ?? 0
  const minStep = round((lightness - minLightness) / 5, 2)

  const values = [
    {key: 0, tweak: Math.round(lightness + maxStep * 5)}, // Closest to 100, lightest colour
    {key: 50, tweak: Math.round(lightness + maxStep * 4.5)},
    {key: 100, tweak: Math.round(lightness + maxStep * 4)},
    {key: 200, tweak: Math.round(lightness + maxStep * 3)},
    {key: 300, tweak: Math.round(lightness + maxStep * 2)},
    {key: 400, tweak: Math.round(lightness + maxStep * 1)},
    {key: 500, tweak: Math.round(lightness)}, // Lightness of original colour
    {key: 600, tweak: Math.round(lightness - minStep * 1)},
    {key: 700, tweak: Math.round(lightness - minStep * 2)},
    {key: 800, tweak: Math.round(lightness - minStep * 3)},
    {key: 900, tweak: Math.round(lightness - minStep * 4)},
    {key: 1000, tweak: Math.round(lightness - minStep * 5)}, // Closest to 0, darkest colour
  ]

  // Each 'tweak' value must be between 0 and 100
  const safeValues = values.map((value) => ({
    ...values,
    tweak: Math.min(Math.max(value.tweak, 0), 100),
  }))

  return safeValues
}
