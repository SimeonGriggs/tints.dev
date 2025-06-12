import chroma from "chroma-js";

import { DEFAULT_PALETTE_CONFIG } from "~/lib/constants";
import type { PaletteConfig } from "~/types";

/**
 * Finds HSL lightness that produces the closest luminance to target
 * Equivalent to legacy lightnessFromHSLum function
 */
function lightnessFromLuminance(
  h: number,
  s: number,
  targetLuminance: number,
): number {
  let bestL = 50;
  let smallestDiff = Infinity;

  // Search through lightness values to find closest luminance match
  for (let l = 0; l <= 100; l++) {
    try {
      const testColor = chroma.hsl(h, s / 100, l / 100);
      const testLuminance = testColor.luminance();
      const diff = Math.abs(targetLuminance - testLuminance);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        bestL = l;
      }
    } catch {
      // Skip invalid color combinations
      continue;
    }
  }

  return bestL;
}

/**
 * Chroma-js based implementation for stable palette generation
 * Uses perceptually uniform color spaces and higher precision
 * Self-contained to avoid infinite loop issues
 */
export function createSwatches(palette: PaletteConfig) {
  const { value, valueStop } = palette;

  // Tweaks may be passed in, otherwise use defaults
  const colorMode = palette.colorMode ?? DEFAULT_PALETTE_CONFIG.colorMode;
  const h = palette.h ?? DEFAULT_PALETTE_CONFIG.h;
  const s = palette.s ?? DEFAULT_PALETTE_CONFIG.s;
  const lMin = palette.lMin ?? DEFAULT_PALETTE_CONFIG.lMin;
  const lMax = palette.lMax ?? DEFAULT_PALETTE_CONFIG.lMax;

  // All available stops (including 0 and 1000 for calculation)
  const allStops = [
    0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000,
  ];

  // Create base color from input
  const baseColor = chroma(`#${value}`);

  // Replicate the original algorithm but use chroma.js for more precision
  // We'll manually implement the scale creation to avoid infinite loops

  // 1. Create hue scale (simplified from createHueScale)
  const valueStopIndex = allStops.indexOf(valueStop);
  if (valueStopIndex === -1) {
    throw new Error(`Invalid valueStop: ${valueStop}`);
  }

  const hueScale = allStops.map((stop) => {
    const stopIndex = allStops.indexOf(stop);
    const diff = Math.abs(stopIndex - valueStopIndex);
    const tweakValue = h ? diff * h : 0;
    return { stop, tweak: tweakValue };
  });

  // 2. Create saturation scale (simplified from createSaturationScale)
  const saturationScale = allStops.map((stop) => {
    const stopIndex = allStops.indexOf(stop);
    const diff = Math.abs(stopIndex - valueStopIndex);
    const tweakValue = s ? Math.round((diff + 1) * s * (1 + diff / 10)) : 0;
    return { stop, tweak: Math.min(tweakValue, 100) };
  });

  // 3. Create lightness distribution (simplified from createDistributionValues)
  const lightnessValue =
    colorMode === "linear"
      ? baseColor.get("hsl.l") * 100
      : baseColor.luminance() * 100;

  // Create the three anchor points
  const distributionAnchors = [
    { stop: 0, tweak: lMax },
    { stop: valueStop, tweak: lightnessValue },
    { stop: 1000, tweak: lMin },
  ];

  // Interpolate for missing stops
  const distributionScale = allStops.map((stop) => {
    // If it's an anchor point, use the anchor value
    const anchor = distributionAnchors.find((a) => a.stop === stop);
    if (anchor) {
      return anchor;
    }

    // Otherwise interpolate between anchor points
    let leftAnchor, rightAnchor;

    if (stop < valueStop) {
      leftAnchor = distributionAnchors[0]; // stop 0
      rightAnchor = distributionAnchors[1]; // valueStop
    } else {
      leftAnchor = distributionAnchors[1]; // valueStop
      rightAnchor = distributionAnchors[2]; // stop 1000
    }

    // Linear interpolation
    const range = rightAnchor.stop - leftAnchor.stop;
    const position = stop - leftAnchor.stop;
    const ratio = position / range;
    const tweak =
      leftAnchor.tweak + (rightAnchor.tweak - leftAnchor.tweak) * ratio;

    return { stop, tweak: Math.round(tweak) };
  });

  const swatches = allStops.map((stop, stopIndex) => {
    if (stop === valueStop) {
      // Preserve exact input color
      const inputColor = chroma(`#${value.toUpperCase()}`);
      const [finalH, finalS, finalL] = inputColor.hsl();

      return {
        stop,
        hex: `#${value.toUpperCase()}`,
        h: isNaN(finalH) ? 0 : finalH,
        hScale: 0,
        s: isNaN(finalS) ? 0 : finalS * 100,
        sScale: (isNaN(finalS) ? 0 : finalS * 100) - 50,
        l: isNaN(finalL) ? 0 : finalL * 100,
      };
    }

    // Get tweaks for this stop
    const hTweak = hueScale[stopIndex].tweak;
    const sTweak = saturationScale[stopIndex].tweak;
    const lTweak = distributionScale[stopIndex].tweak;

    // Apply tweaks using chroma.js for better precision
    const [baseH, baseS] = baseColor.hsl();

    const newH = (baseH + hTweak) % 360;
    const newS = Math.max(0, Math.min(100, baseS * 100 + sTweak));

    let newL: number;
    if (colorMode === "linear") {
      // Direct lightness approach
      newL = Math.max(0, Math.min(100, lTweak));
    } else {
      // Perceived brightness approach: find lightness that produces target luminance
      const targetLuminance = lTweak / 100; // Convert to 0-1 range
      newL = lightnessFromLuminance(
        isNaN(newH) ? baseH : newH,
        isNaN(newS) ? baseS * 100 : newS,
        targetLuminance,
      );
    }

    const newColor = chroma.hsl(
      isNaN(newH) ? baseH : newH,
      isNaN(newS) ? baseS : newS / 100,
      newL / 100,
    );

    const [finalH, finalS, finalL] = newColor.hsl();

    return {
      stop,
      hex: newColor.hex().toUpperCase(),
      h: isNaN(finalH) ? 0 : finalH,
      hScale: ((((hTweak + 180) % 360) - 180) / 180) * 50,
      s: isNaN(finalS) ? 0 : finalS * 100,
      sScale: (isNaN(finalS) ? 0 : finalS * 100) - 50,
      l: isNaN(finalL) ? 0 : finalL * 100,
    };
  });

  return swatches;
}
