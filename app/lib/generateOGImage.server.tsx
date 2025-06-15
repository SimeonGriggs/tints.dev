import type { PaletteConfig } from "~/types";

export async function generateOGImage(
  palettes: PaletteConfig[],
  origin: string,
) {
  const { createCanvas } = await import("canvas");
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");

  // Fill background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1200, 630);

  // Draw title
  ctx.fillStyle = "#000000";
  ctx.font = "bold 48px Inter";
  ctx.textAlign = "center";
  ctx.fillText("Tints.dev", 600, 100);

  // Draw palettes
  const swatches = palettes[0].swatches;
  const swatchWidth = 1000 / swatches.length;
  const startX = (1200 - 1000) / 2;
  const startY = 200;

  swatches.forEach((swatch, i) => {
    ctx.fillStyle = `#${swatch.hex}`;
    ctx.fillRect(startX + i * swatchWidth, startY, swatchWidth, 200);
  });

  // Draw URL
  ctx.fillStyle = "#666666";
  ctx.font = "24px Inter";
  ctx.fillText(origin, 600, 500);

  return canvas.toBuffer("image/png");
}
