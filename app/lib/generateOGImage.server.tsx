import { Resvg } from "@resvg/resvg-js";
import type { SatoriOptions } from "satori";
import satori from "satori";

import { META, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/lib/constants";
import type { PaletteConfig } from "~/types";

const fontMono = (baseUrl: string) =>
  fetch(new URL(`${baseUrl}/fonts/JetBrainsMono-Regular.ttf`)).then((res) =>
    res.arrayBuffer(),
  );
const fontSans = (baseUrl: string) =>
  fetch(new URL(`${baseUrl}/fonts/Inter-ExtraBold.otf`)).then((res) =>
    res.arrayBuffer(),
  );

export async function generateOGImage(
  palettes: PaletteConfig[],
  origin: string,
  canonical: string,
) {
  const fontMonoData = await fontMono(origin);
  const fontSansData = await fontSans(origin);
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

  const displayUrl = canonical.replace(/(^\w+:|^)\/\//, "").replace("www.", "");

  const svg = await satori(
    <div
      style={{
        width: options.width,
        height: options.height,
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
        {palette.swatches
          .filter((swatch) => ![0, 1000].includes(swatch.stop))
          .map((swatch) => (
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
                  boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.125)",
                  height: 64,
                  width: `100%`,
                }}
                className="h-12 xl:h-16 w-full rounded-sm shadow-inner flex flex-col items-center justify-center transition-colors duration-500"
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
                <div
                  style={{
                    display: "flex",
                    fontVariantNumeric: "tabular-nums",
                    opacity: 0.5,
                  }}
                >
                  {swatch.hex.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
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
          // clipPath: `polygon(0 20%, 100% 0, 100% 100%, 0% 100%)`,
        }}
        className="pt-20 p-12 text-white flex flex-col gap-3"
      >
        <span
          style={{ fontSize: 48, whiteSpace: "nowrap" }}
          // className="text-5xl whitespace-nowrap"
        >
          {displayUrl}
        </span>
        <span
          style={{
            color: lightColor,
            fontSize: 24,
            whiteSpace: "nowrap",
          }}
          // className="text-2xl font-bold whitespace-nowrap"
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
