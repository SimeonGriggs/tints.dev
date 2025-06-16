import { nanoid } from "nanoid";

import { DEFAULT_PALETTE_CONFIG, RANDOM_PALETTES } from "~/lib/constants";
import { createSwatches } from "~/lib/createSwatches";
import { calculateStopFromColor } from "~/lib/helpers";

export function createRandomPalette(currentValues: string[] = []) {
  const randomsWithoutCurrentValues = RANDOM_PALETTES.filter((p) =>
    currentValues?.length
      ? !currentValues
          .map((v) => v.toUpperCase())
          .includes(p.value.toUpperCase())
      : true
  );

  const defaults = {
    ...DEFAULT_PALETTE_CONFIG,
    id: nanoid(),
    ...randomsWithoutCurrentValues[
      Math.floor(Math.random() * randomsWithoutCurrentValues.length)
    ],
    swatches: [],
  };

  const palette = {
    ...defaults,
    valueStop: calculateStopFromColor(defaults.value, defaults.colorMode),
    swatches: createSwatches({
      ...defaults,
      valueStop: calculateStopFromColor(defaults.value, defaults.colorMode),
    }),
  };

  return palette;
}
