import {nanoid} from 'nanoid'

import {DEFAULT_PALETTE_CONFIG, META} from '~/lib/constants'
import {
  createRandomPalette,
  createSwatches,
  isHex,
  isValidName,
  removeTrailingSlash,
} from '~/lib/helpers'
import type {PaletteConfig} from '~/types/palette'

export function createPaletteFromNameValue(name: string, value: string) {
  if (!name || !isValidName(name) || !value || !isHex(value)) {
    return null
  }

  const nameValue = {
    ...DEFAULT_PALETTE_CONFIG,
    id: nanoid(),
    name,
    value: value.toUpperCase(),
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
  } else if (typeof document !== 'undefined') {
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
  const metaImageUrl = [META.origin, palette.name, palette.value.toUpperCase(), 'meta'].join('/')

  const imageWidth = `1200`
  const imageHeight = `630`
  const imageUrl = new URL(`https://api.apiflash.com/v1/urltoimage`)
  imageUrl.searchParams.set(`access_key`, `20f8de307f854876a99bb1bb1efe5257`)
  imageUrl.searchParams.set(`url`, metaImageUrl)
  imageUrl.searchParams.set(`height`, imageHeight)
  imageUrl.searchParams.set(`width`, imageWidth)
  imageUrl.searchParams.set(`format`, `png`)
  imageUrl.searchParams.set(`response_type`, `image`)
  imageUrl.searchParams.set(`scale_factor`, `2`)
  imageUrl.searchParams.set(`wait_for`, `#meta-image`)
  imageUrl.searchParams.set(`fail_on_status`, `300-399,400-499,500-599`)

  return {
    url: imageUrl.toString(),
    width: imageWidth,
    height: imageHeight,
  }
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
    palette.swatches
      .filter((swatch) => ![0, 1000].includes(swatch.stop))
      .forEach((swatch) => Object.assign(swatches, {[swatch.stop]: swatch.hex.toUpperCase()}))

    Object.assign(shaped, {[palette.name]: swatches})
  })

  return shaped
}
