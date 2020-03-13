function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0;
  let g = 0;
  let b = 0;
  if (H.length === 4) {
    r = `0x${H[1]}${H[1]}`;
    g = `0x${H[2]}${H[2]}`;
    b = `0x${H[3]}${H[3]}`;
  } else if (H.length === 7) {
    r = `0x${H[1]}${H[2]}`;
    g = `0x${H[3]}${H[4]}`;
    b = `0x${H[5]}${H[6]}`;
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  //   return `hsl(${h},${s}%,${l}%)`;
  return { h, s, l };
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length === 1) r = `0${r}`;
  if (g.length === 1) g = `0${g}`;
  if (b.length === 1) b = `0${b}`;

  return `#${r}${g}${b}`;
}

function isHex(value) {
  const re = new RegExp(/^#[0-9A-F]{6}$/i);

  return re.test(value);
}

function createScale(tweakValue) {
  const tweak = parseInt(tweakValue) || 20;

  return {
    0: -Math.round(tweak * 10) / 10,
    1: -Math.round(tweak * 0.75 * 10) / 10,
    2: -Math.round(tweak * 0.5 * 10) / 10,
    3: -Math.round(tweak * 0.25 * 10) / 10,
    4: 0,
    5: Math.round(tweak * 0.25 * 10) / 10,
    6: Math.round(tweak * 0.5 * 10) / 10,
    7: Math.round(tweak * 0.75 * 10) / 10,
    8: Math.round(tweak * 10) / 10,
  };
}

function createPalette() {
  const colorInput = document.querySelector('[data-color-input]');
  const colorHue = document.querySelector('[data-color-hue]');
  const colorSaturation = document.querySelector('[data-color-saturation]');
  const colorLightness = document.querySelector('[data-color-lightness]');
  const colorSwatches = document.querySelectorAll('[data-color-swatch]');

  const { value } = colorInput;

  // Make sure it's a hex value
  if (value && value.length === 7 && isHex(value)) {
    // Create the HSL value
    const valueHsl = hexToHSL(value);

    const hueScale = createScale(colorHue.value);
    const saturationScale = createScale(colorSaturation.value);
    const lightnessScale = createScale(colorLightness.value);

    const { h, s, l } = valueHsl;
    const palette = {};

    for (let i = 0; i < colorSwatches.length; i++) {
      const paletteI = (i + 1) * 100;
      const newH = h + hueScale[i];
      const newS = s + saturationScale[i];
      const newL = l - lightnessScale[i];
      const paletteHex = HSLToHex(newH, newS, newL);

      palette[paletteI] = newL > 100 ? `Too light!` : paletteHex;

      colorSwatches[i].style.backgroundColor = paletteHex;
    }

    const output = document.querySelector('[data-output]');
    output.innerHTML = `awesomeColor: ${JSON.stringify(palette, null, '  ')}`;
  }
}

/**
 * Color controller
 */
const colorControllers = document.querySelectorAll('[data-color-controller]');

if (colorControllers) {
  colorControllers.forEach(controller => {
    controller.addEventListener('input', () => createPalette());
    controller.addEventListener('focus', () => createPalette());
    controller.addEventListener('blur', () => createPalette());
  });
}
