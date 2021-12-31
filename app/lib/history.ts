import {createCanonicalUrl} from './responses'
import {PaletteConfig} from '~/types/palette'

export function removeSearchParamByKey(key: string) {
  if (typeof window !== 'undefined') {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.delete(key)
    window.history.pushState({}, '', currentUrl.toString())
  }
}

export function convertParamsToPath(palettes: PaletteConfig[]) {
  if (typeof window !== 'undefined') {
    const canonicalUrl = new URL(createCanonicalUrl(palettes))
    const currentUrl = new URL(window.location.href)
    currentUrl.pathname = canonicalUrl.pathname
    Array.from(currentUrl.searchParams.keys()).forEach((key) => {
      currentUrl.searchParams.delete(key)
    })

    window.history.replaceState({}, '', currentUrl.toString())
  }
}
