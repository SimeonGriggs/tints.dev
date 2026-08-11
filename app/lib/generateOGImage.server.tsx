import { initWasm, Resvg } from "@resvg/resvg-wasm";
import wasm from "@resvg/resvg-wasm/index_bg.wasm";
import type { SatoriOptions } from "satori";
import satori from "satori";

import { META, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/lib/constants";
import type { PaletteConfig } from "~/types";

const FONT_PATHS = {
  mono: "/fonts/JetBrainsMono-Regular.ttf",
  sans: "/fonts/Inter-ExtraBold.otf",
} as const;

let wasmInitialized: Promise<void> | undefined;
let fontsPromise: Promise<{ mono: ArrayBuffer; sans: ArrayBuffer }> | undefined;

async function ensureWasmInitialized() {
  if (!wasmInitialized) {
    wasmInitialized = initWasm(wasm);
  }

  await wasmInitialized;
}

async function fetchFont(assets: Fetcher, path: string) {
  const response = await assets.fetch(
    new Request(`https://assets.local${path}`),
  );

  if (!response.ok) {
    throw new Error(`Failed to load font ${path}: ${response.status}`);
  }

  return response.arrayBuffer();
}

async function loadFonts(assets: Fetcher) {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      fetchFont(assets, FONT_PATHS.mono),
      fetchFont(assets, FONT_PATHS.sans),
    ])
      .then(([mono, sans]) => ({ mono, sans }))
      .catch((error) => {
        fontsPromise = undefined;
        throw error;
      });
  }

  return fontsPromise;
}

export async function generateOGImage(
  palettes: PaletteConfig[],
  assets: Fetcher,
) {
  await ensureWasmInitialized();
  const { mono: fontMonoData, sans: fontSansData } = await loadFonts(assets);

  const options: SatoriOptions = {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts: [
      {
        name: "JetBrains Mono",
        data: fontMonoData,
        style: "normal",
      },
      {
        name: "Inter",
        data: fontSansData,
        style: "normal",
      },
    ],
  };

  const [palette] = palettes;
  const darkColor = palette.swatches.find((swatch) => swatch.stop === 800)?.hex;
  const lightColor = palette.swatches.find(
    (swatch) => swatch.stop === 300,
  )?.hex;

  const svg = await satori(
    <div
      style={{
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        backgroundColor: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          gap: 12,
          padding: `36px 48px 0px`,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontFamily: "JetBrains Mono, monospace",
            color: darkColor,
          }}
        >
          {palette.name}
        </span>{" "}
        <span
          style={{
            color: lightColor,
            fontSize: 48,
            fontFamily: "Inter, sans-serif",
            transform: `translateY(-12px)`,
          }}
        >
          #{palette.value.toUpperCase()}
        </span>
      </div>
      {/* Palette */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0,
          fontSize: 24,
          padding: `0 48px`,
          fontFamily: "JetBrains Mono, monospace",
          margin: `0 -6px`,
        }}
      >
        {palette.swatches.flatMap((swatch) => {
          if (swatch.stop === 0 || swatch.stop === 1000) {
            return [];
          }
          return [
            <div
              key={swatch.stop}
              style={{
                display: "flex",
                flexDirection: "column",
                width: `16.66%`,
                padding: `0 12px`,
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  backgroundColor: swatch.hex,
                  borderRadius: 4,
                  height: 64,
                  width: `100%`,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: `0 4px 24px`,
                  fontSize: 20,
                }}
              >
                <div style={{ display: "flex" }}>{swatch.stop}</div>
              </div>
            </div>,
          ];
        })}
      </div>
      {/* Footer */}
      <div
        style={{
          backgroundColor: darkColor,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 48,
          marginTop: "auto",
          fontFamily: "Inter, sans-serif",
          color: "white",
        }}
        className="pt-20 p-12 text-white flex flex-col gap-3"
      >
        <span style={{ fontSize: 48, whiteSpace: "nowrap" }}>
          {new URL(META.origin).hostname}
        </span>
        <span
          style={{
            color: lightColor,
            fontSize: 24,
            whiteSpace: "nowrap",
          }}
        >
          {META.title}
        </span>
      </div>
    </div>,
    options,
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
}
