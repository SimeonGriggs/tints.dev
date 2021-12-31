import {createCanonicalUrl, createPaletteMetaImageUrl} from './responses'
import {PaletteConfig} from '~/types/palette'

export function handleMeta(palettes: PaletteConfig[]) {
  if (!palettes.length) {
    return
  }

  // Generate a nice title for the colors
  // [blue, green, orange] => "Blue, Green & Orange"
  const paletteNames = palettes
    .map(({name}) => name)
    .reduce((acc, cur, curIndex, arr) => {
      const curTitleCase = cur.charAt(0).toUpperCase() + cur.slice(1)

      // Last name
      if (curIndex === arr.length - 1) {
        return `${acc} ${curTitleCase}`
      }

      // Second last name
      if (curIndex === arr.length - 2) {
        return acc ? `${acc} ${curTitleCase} &` : `${curTitleCase} &`
      }

      return acc ? `${acc} ${curTitleCase},` : `${curTitleCase},`
    }, ``)

  const documentTitle = [
    paletteNames,
    `10-Color`,
    palettes.length === 1 ? `Palette` : `Palettes`,
    `for Tailwind CSS`,
  ].join(` `)

  // Update document title
  if (typeof document !== 'undefined') {
    document.title = documentTitle
  }

  // Update the URL
  if (typeof window !== 'undefined') {
    const currentUrl = new URL(window.location.href)

    if (palettes.length === 1) {
      // One palette === pretty url
      const canonicalPath = new URL(createCanonicalUrl(palettes)).pathname
      currentUrl.pathname = canonicalPath
      currentUrl.search = ``
    } else {
      // Many palettes === query string
      palettes.forEach((palette) => {
        currentUrl.searchParams.set(palette.name, palette.value.toUpperCase())
      })
      currentUrl.pathname = ``
    }

    // Update without pushing to history
    window.history.replaceState({}, '', currentUrl.toString())
  }

  // Update meta tags
  if (typeof window !== 'undefined') {
    const metaTitleTag = document.querySelector(`meta[name="twitter:title"]`)
    // const metaDescription = document.querySelector(`meta[name="description"]`)

    if (metaTitleTag) {
      metaTitleTag.setAttribute(`content`, documentTitle)
    }

    const themeColorTag = document.querySelector(`meta[name="theme-color"]`)
    const themeColorValue = palettes[0].swatches.find((swatch) => swatch.stop === 500)?.hex

    if (themeColorTag && themeColorValue) {
      themeColorTag.setAttribute(`content`, themeColorValue)
    }

    const canonicalLinkTag = document.querySelector(`link[rel="canonical"]`)
    const canonicalUrl = createCanonicalUrl(palettes)

    if (canonicalLinkTag) {
      canonicalLinkTag.setAttribute(`href`, canonicalUrl)
    }

    const canonicalOGTag = document.querySelector(`meta[property="og:url"]`)

    if (canonicalOGTag) {
      canonicalOGTag.setAttribute(`content`, canonicalUrl)
    }

    const metaImageTag = document.querySelector(`meta[property="og:image"]`)

    if (metaImageTag) {
      const {url: metaImageUrl} = createPaletteMetaImageUrl(palettes[0])
      metaImageTag.setAttribute(`content`, metaImageUrl)
    }
  }
}
