import {PaletteConfig} from '~/types/palette'
import {createRandomPalette, createSwatches, isHex, removeTrailingSlash} from '~/lib/helpers'
import {DEFAULT_PALETTE_CONFIG, META} from '~/lib/constants'

export function createPaletteFromNameValue(name: string, value: string) {
  if (!name || !value || !isHex(value)) {
    return null
  }

  const nameValue = {
    name,
    value: value.toUpperCase(),
    useLightness: DEFAULT_PALETTE_CONFIG.useLightness,
    swatches: [],
  }

  return {
    ...nameValue,
    swatches: createSwatches(nameValue),
  }
}

export function createCanonicalUrl(palettes: PaletteConfig[], apiUrl = false) {
  const baseUrl = apiUrl ? `${META.origin}/api` : META.origin

  if (!palettes?.length) {
    // This shouldn't be possible?
    return removeTrailingSlash(baseUrl)
  } else if (palettes.length === 1) {
    // Single palettes have pretty URLs
    const canonicalUrl = [baseUrl, palettes[0].name, palettes[0].value.toUpperCase()].join(`/`)

    return removeTrailingSlash(canonicalUrl)
  } else if (typeof window !== 'undefined') {
    // Use the current URL but maybe replace the base URL
    const currentUrl = new URL(window.location.href)
    const canonicalUrl = currentUrl.toString().replace(currentUrl.origin, baseUrl)

    return removeTrailingSlash(canonicalUrl)
  }

  // Create a complete URL from current palettes
  const canonicalUrl = new URL(baseUrl)
  palettes.forEach((palette) => {
    canonicalUrl.searchParams.set(palette.name, palette.value.toUpperCase())
  })

  return removeTrailingSlash(canonicalUrl.toString())
}

export function createPaletteMetaImageUrl(palette: PaletteConfig) {
  return [META.origin, palette.name, palette.value.toUpperCase(), 'meta.png'].join('/')
}

// Turn request URL object into initial palettes
export function requestToPalettes(url: string) {
  const requestUrl = new URL(url)

  if (!requestUrl) {
    return []
  }

  const palettesParams = requestUrl.searchParams
  const palettes: PaletteConfig[] = []

  // Turn config strings into array of config objects
  if (Array.from(palettesParams.keys()).length) {
    palettesParams.forEach((value, key) => {
      if (isHex(value)) {
        // TODO: Sanitize inputs
        const palette = createPaletteFromNameValue(key, value)

        if (palette) {
          palettes.push(palette)
        }
      }
    })
  } else {
    // Start with a random default palette if no query string provided
    const random = createRandomPalette()

    palettes.push(random)
  }

  return palettes
}

// Convert array of palette objects used in GUI to array of colour swatches for Tailwind Config
export function output(palettes: PaletteConfig[]) {
  const shaped = {}

  palettes.forEach((palette) => {
    const swatches = {}
    palette.swatches.forEach((swatch) =>
      Object.assign(swatches, {[swatch.stop]: swatch.hex.toUpperCase()})
    )

    Object.assign(shaped, {[palette.name]: swatches})
  })

  return shaped
}
