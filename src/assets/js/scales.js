export function createSaturationScale(tweakValue) {
  const tweak = parseInt(tweakValue) || 0;

  return [
    Math.round(tweak),
    Math.round(tweak * 0.75),
    Math.round(tweak * 0.5),
    Math.round(tweak * 0.25),
    0,
    Math.round(tweak * 0.25),
    Math.round(tweak * 0.5),
    Math.round(tweak * 0.75),
    Math.round(tweak),
  ];
}

export function createHueScale(tweakValue) {
  const tweak = parseInt(tweakValue) || 0;

  return [
    tweak ? tweak * 3 + tweak : 0,
    tweak ? tweak * 2 + tweak : 0,
    tweak ? tweak * 1 + tweak : 0,
    tweak ? tweak + 0 : 0,
    0,
    tweak || 0,
    tweak ? tweak * 1 + tweak : 0,
    tweak ? tweak * 2 + tweak : 0,
    tweak ? tweak * 3 + tweak : 0,
  ];
}

export function createLightnessValues(min, max, lightness) {
  const maxLightness = parseInt(max) || 100;
  const maxStep = (maxLightness - lightness) / 4;

  const minLightness = parseInt(min) || 0;
  const minStep = (lightness - minLightness) / 4;

  return [
    Math.round(lightness + maxStep * 4), // Should equal tweakMin, close to 100, lightest colour
    Math.round(lightness + maxStep * 3),
    Math.round(lightness + maxStep * 2),
    Math.round(lightness + maxStep * 1),
    Math.round(lightness), // Lightness of original colour
    Math.round(minLightness + minStep * 3),
    Math.round(minLightness + minStep * 2),
    Math.round(minLightness + minStep),
    Math.round(minLightness), // Should equal tweakMax, close to 0, darkest colour
  ];
}
