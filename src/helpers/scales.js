export function createSaturationScale(tweakValue) {
  const tweak = parseInt(tweakValue) || 0;

  return [
    { key: 50, tweak: Math.round(tweak * 1.125) },
    { key: 100, tweak: Math.round(tweak) },
    { key: 200, tweak: Math.round(tweak * 0.75) },
    { key: 300, tweak: Math.round(tweak * 0.5) },
    { key: 400, tweak: Math.round(tweak * 0.25) },
    { key: 500, tweak: 0 },
    { key: 600, tweak: Math.round(tweak * 0.25) },
    { key: 700, tweak: Math.round(tweak * 0.5) },
    { key: 800, tweak: Math.round(tweak * 0.75) },
    { key: 900, tweak: Math.round(tweak) },
  ];
}

export function createHueScale(tweakValue) {
  const tweak = parseInt(tweakValue) || 0;
  return [
    { key: 50, tweak : tweak ? tweak * 3.5 + tweak : 0 },
    { key: 100, tweak : tweak ? tweak * 3 + tweak : 0 },
    { key: 200, tweak : tweak ? tweak * 2 + tweak : 0 },
    { key: 300, tweak : tweak ? tweak * 1 + tweak : 0 },
    { key: 400, tweak : tweak ? tweak + 0 : 0 },
    { key: 500, tweak : 0 },
    { key: 600, tweak : tweak || 0 },
    { key: 700, tweak : tweak ? tweak * 1 + tweak : 0 },
    { key: 800, tweak : tweak ? tweak * 2 + tweak : 0 },
    { key: 900, tweak : tweak ? tweak * 3 + tweak : 0 },
  ];
}

export function createDistributionValues(min, max, lightness) {
  const maxLightness = parseInt(max) || 100;
  const maxStep = (maxLightness - lightness) / 4;

  const minLightness = parseInt(min) || 0;
  const minStep = (lightness - minLightness) / 4;

  return [
    { key: 50, tweak: Math.round(lightness + maxStep * 4.5)}, // Should equal tweakMin, close to 100, lightest colour
    { key: 100, tweak: Math.round(lightness + maxStep * 4)}, // Should equal tweakMin, close to 100, lightest colour
    { key: 200, tweak: Math.round(lightness + maxStep * 3)},
    { key: 300, tweak: Math.round(lightness + maxStep * 2)},
    { key: 400, tweak: Math.round(lightness + maxStep * 1)},
    { key: 500, tweak: Math.round(lightness)}, // Lightness of original colour
    { key: 600, tweak: Math.round(minLightness + minStep * 3)},
    { key: 700, tweak: Math.round(minLightness + minStep * 2)},
    { key: 800, tweak: Math.round(minLightness + minStep)},
    { key: 900, tweak: Math.round(minLightness), }// Should equal tweakMax, close to 0, darkest colour
  ];
}
