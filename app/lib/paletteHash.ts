import type { PaletteConfig } from "~/types";

/**
 * Serialize a palette config to a URL-safe string
 */
export function serializePalette(palette: PaletteConfig): string {
  const json = JSON.stringify(palette);
  // Use base64url encoding (URL-safe base64)
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Deserialize a URL-safe string back to a palette config
 */
export function deserializePalette(hash: string): PaletteConfig | null {
  try {
    // Convert base64url back to standard base64
    const base64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as PaletteConfig;
  } catch (error) {
    console.error("Failed to deserialize palette:", error);
    return null;
  }
}
