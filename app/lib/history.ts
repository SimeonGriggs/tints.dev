import type { PaletteConfig } from "~/types";

import { createCanonicalUrl } from "./responses";

export function removeSearchParamByKey(key: string) {
  if (typeof document !== "undefined") {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete(key);
    window.history.pushState({}, "", currentUrl.toString());
  }
}

export function convertParamsToPath(palettes: PaletteConfig[]) {
  if (typeof document !== "undefined") {
    const canonicalUrl = new URL(createCanonicalUrl(palettes));
    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = canonicalUrl.pathname;
    Array.from(currentUrl.searchParams.keys()).forEach((key) => {
      currentUrl.searchParams.delete(key);
    });

    window.history.replaceState({}, "", currentUrl.toString());
  }
}
