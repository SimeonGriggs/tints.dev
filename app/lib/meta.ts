import type { PaletteConfig } from "~/types";

import { titleCase } from "./helpers";
import { createCanonicalUrl, createPaletteMetaImageUrl } from "./responses";

export function handleMeta(palettes: PaletteConfig[], updateHistory = false) {
  if (!palettes.length) {
    return;
  }

  let paletteIsRandom = false;

  // If the palette loaded was random, we'll exit after changing the URL
  if (typeof document !== "undefined") {
    if (window.location.pathname === `/` && !window.location.search) {
      paletteIsRandom = true;
    }
  }

  // Update the URL
  if (typeof document !== "undefined") {
    const currentUrl = new URL(window.location.href);
    const canonicalPath = new URL(createCanonicalUrl(palettes)).pathname;
    currentUrl.pathname = canonicalPath;
    currentUrl.search = ``;

    // Update without pushing to history
    if (updateHistory) {
      window.history.pushState({}, "", currentUrl.toString());
    } else {
      window.history.replaceState({}, "", currentUrl.toString());
    }
  }

  if (paletteIsRandom) {
    return;
  }

  // Generate a nice title for the colors
  // [blue, green, orange] => "Blue, Green & Orange"
  const paletteNames = palettes.map(({ name }) => titleCase(name));
  const paletteTitle = new Intl.ListFormat("en").format(paletteNames);

  const documentTitle = [
    paletteTitle,
    `11-Color`,
    palettes.length === 1 ? `Palette` : `Palettes`,
    `Generated for Tailwind CSS`,
  ].join(` `);

  // Update document title
  if (typeof document !== "undefined") {
    document.title = documentTitle;
  }

  // Update meta tags
  if (typeof document !== "undefined") {
    const metaTitleTag = document.querySelector(`meta[name="twitter:title"]`);

    if (metaTitleTag) {
      metaTitleTag.setAttribute(`content`, documentTitle);
    }

    const themeColorTag = document.querySelector(`meta[name="theme-color"]`);
    const themeColorValue = palettes[0].swatches.find(
      (swatch) => swatch.stop === 500,
    )?.hex;

    if (themeColorTag && themeColorValue) {
      themeColorTag.setAttribute(`content`, themeColorValue.toUpperCase());
    }

    const canonicalLinkTag = document.querySelector(`link[rel="canonical"]`);
    const canonicalUrl = createCanonicalUrl(palettes);

    if (canonicalLinkTag) {
      canonicalLinkTag.setAttribute(`href`, canonicalUrl);
    }

    const ogUrlTag = document.querySelector(`meta[property="og:url"]`);

    if (ogUrlTag) {
      ogUrlTag.setAttribute(`content`, canonicalUrl);
    }

    const ogTitleTag = document.querySelector(`meta[property="og:title"]`);

    if (ogTitleTag) {
      ogTitleTag.setAttribute(`content`, documentTitle);
    }

    const ogImageTag = document.querySelector(`meta[property="og:image"]`);

    if (ogImageTag) {
      const { url: metaImageUrl } = createPaletteMetaImageUrl(palettes[0]);
      ogImageTag.setAttribute(`content`, metaImageUrl);
    }
  }
}
