import type { Mode, PaletteConfig, Version } from "~/types";

export const DEFAULT_STOP = 500;
export const DEFAULT_STOPS = [
  0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000,
];

export const MODES: Mode[] = [`oklch`, `hex`, `p-3`, `hsl`];
export const DEFAULT_MODE = MODES[0];

export const DEFAULT_PALETTE_CONFIG: PaletteConfig = {
  id: ``,
  name: ``,
  value: ``,
  valueStop: DEFAULT_STOP,
  swatches: [],
  h: 0,
  s: 0,
  lMin: 0,
  lMax: 100,
  colorMode: "perceived",
  mode: MODES[0],
  stopSelection: "auto",
};

export const RANDOM_PALETTES = [
  { name: `blue`, value: `3B82F6` },
  { name: `red`, value: `EF4444` },
  { name: `green`, value: `22C55E` },
  { name: `purple`, value: `A855F7` },
  { name: `indigo`, value: `6366F1` },
  { name: `pink`, value: `EC4899` },
  { name: `orange`, value: `F97316` },
  { name: `teal`, value: `14B8A6` },
  { name: `cyan`, value: `06B6D4` },
  { name: `yellow`, value: `EAB308` },
  { name: `lime`, value: `84CC16` },
  { name: `emerald`, value: `10B981` },
  { name: `violet`, value: `8B5CF6` },
  { name: `fuchsia`, value: `D946EF` },
  { name: `rose`, value: `F43F5E` },
  { name: `amber`, value: `F59E0B` },
  { name: `sky`, value: `0EA5E9` },
  { name: `slate`, value: `64748B` },
  { name: `zinc`, value: `71717A` },
  { name: `stone`, value: `78716C` },
  { name: `gray`, value: `6B7280` },
  { name: `mint`, value: `34D399` },
  { name: `lavender`, value: `A78BFA` },
  { name: `coral`, value: `F87171` },
  { name: `peach`, value: `FB923C` },
  { name: `sage`, value: `86EFAC` },
  { name: `ocean`, value: `0EA5E9` },
  { name: `plum`, value: `C026D3` },
  { name: `ruby`, value: `DC2626` },
  { name: `gold`, value: `FBBF24` },
  { name: `jade`, value: `059669` },
  { name: `maroon`, value: `B91C1C` },
  { name: `navy`, value: `1E40AF` },
];

export const META = {
  origin: `https://tints.dev`,
  title: `Tailwind CSS 11-color Palette Generator and API`,
  description: `A fast and flexible, HSL-tweakable palette generator and API for Tailwind CSS`,
};

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const VERSIONS: Version[] = ["4", "3"];
