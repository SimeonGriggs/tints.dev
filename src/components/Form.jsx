import React, { useState, useEffect, useCallback } from 'react';

import FormInput from './FormInput.jsx';
import { hexToHSL, HSLToHex, isHex, round } from '../helpers/helpers.js';
import {
  createSaturationScale,
  createHueScale,
  createLightnessValues,
} from '../helpers/scales.js';

const Form = ({ palettes, setPalettes, labels }) => {
  const buttonClasses =
    'p-2 mr-2 mb-2 bg-gray-100 rounded leading-none uppercase font-bold text-sm hover:bg-gray-200';

  const [tweaks, setTweaks] = useState({
    name: 'green',
    hex: '#28C76F',
    h: 0,
    hScale: 0,
    s: 0,
    sScale: 0,
    lMax: 97,
    lMin: 10,
  });

  useEffect(() => {
    const newPalette = {};

    if (tweaks.hex.length === 7 && isHex(tweaks.hex)) {
      const inputHsl = hexToHSL(tweaks.hex);
      const { h, s, l } = inputHsl;

      const hueScale = createHueScale(tweaks.h);
      const saturationScale = createSaturationScale(tweaks.s);
      const lightnessScale = createLightnessValues(tweaks.lMin, tweaks.lMax, l);

      hueScale.forEach((swatch, i) => {
        // Hue value must be between 0-360
        // todo: fix this inside the function
        let newH = h + hueScale[i];
        newH = newH < 0 ? 360 + newH - 1 : newH;
        newH = newH > 720 ? newH - 360 : newH;
        newH = newH > 360 ? newH - 360 : newH;

        // Saturation must be between 0-100
        // todo: fix this inside the function
        let newS = s + saturationScale[i];
        newS = newS > 100 ? 100 : newS;

        const newL = lightnessScale[i];

        const newHex = HSLToHex(newH, newS, newL);
        const paletteI = (i + 1) * 100;

        newPalette[paletteI] = {
          hex: newHex,
          h: newH,
          hScale: hueScale[i],
          s: round(newS, 2),
          sScale: saturationScale[i],
          l: round(newL, 2),
        };
      });

      console.log(newPalette);
    }

    setPalettes({
      [tweaks.name]: newPalette,
    });
  }, [
    setPalettes,
    tweaks.h,
    tweaks.hex,
    tweaks.lMax,
    tweaks.lMin,
    tweaks.name,
    tweaks.s,
  ]);

  return (
    <>
      <div className="text-gray-500">
        <span
          className={` ${buttonClasses} bg-gray-500 text-white pointer-events-none`}
        >
          Presets:
        </span>
        <button
          className={buttonClasses}
          type="button"
          onClick={() =>
            setTweaks({ ...tweaks, name: 'purple', hex: '#9708CC' })
          }
        >
          Purple
        </button>
        <button
          className={buttonClasses}
          type="button"
          onClick={() => setTweaks({ ...tweaks, name: 'blue', hex: '#43CBFF' })}
        >
          Blue
        </button>
        <button
          className={buttonClasses}
          type="button"
          onClick={() =>
            setTweaks({ ...tweaks, name: 'green', hex: '#28C76F' })
          }
        >
          Green
        </button>
      </div>
      <form className="flex space-x-4 mb-4 p-4 w-full mx-auto bg-gray-200 rounded-lg">
        {Object.keys(tweaks).map((input, index) => (
          <FormInput
            key={index}
            input={input}
            tweaks={tweaks}
            setTweaks={setTweaks}
            labels={labels}
            type={typeof tweaks[input] === 'string' ? 'text' : 'number'}
          />
        ))}
      </form>
    </>
  );
};

export default Form;
