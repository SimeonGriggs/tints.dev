import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDebounceCallback } from "usehooks-ts";

import Button from "~/components/Button";
import { inputClasses, labelClasses } from "~/components/Palette";
import { DEFAULT_MODE } from "~/lib/constants";
import { createDisplayColor } from "~/lib/createDisplayColor";
import { hexToHSL, HSLToHex, round } from "~/lib/helpers";
import type { Mode, SwatchValue } from "~/types";

type SwatchProps = {
  swatch: SwatchValue;
  selected?: boolean;
  mode?: Mode;
  onClick?: (swatch: SwatchValue) => void;
  onColorChange?: (stop: number, newColor: string) => void;
};

export default function Swatch(props: SwatchProps) {
  const {
    swatch,
    selected = false,
    mode = DEFAULT_MODE,
    onClick,
    onColorChange,
  } = props;
  const [colorValue, setColorValue] = useState(swatch.hex);
  const debounceOnColorChange = useDebounceCallback((newColor: string) => {
    if (onColorChange) {
      onColorChange(swatch.stop, newColor);
    }
  }, 500);

  let display = createDisplayColor(swatch.hex, mode);

  const handleClick = () => {
    if (onClick) {
      onClick(swatch);
    }
  };

  const { h, s, l: lightness } = hexToHSL(colorValue);

  const handleColorPickerChange = (newColor: string) => {
    setColorValue(newColor);
    debounceOnColorChange(newColor);
  };

  const handleLightnessChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLightness = Number(e.target.value);

      if (newLightness < 0 || newLightness > 100) {
        return;
      }

      const newValue = HSLToHex(h, s, newLightness);
      setColorValue(newValue);
      debounceOnColorChange(newValue);
    },
    [h, s, debounceOnColorChange]
  );

  return (
    <div className="flex-1 flex flex-col gap-2 sm:gap-1">
      <Popover className="relative">
        {({ close }) => (
          <>
            <PopoverButton
              className={`h-12 xl:h-16 w-full rounded-sm flex flex-col items-center justify-center transition-colors duration-500 ${
                onClick
                  ? "cursor-pointer hover:ring-1 hover:ring-gray-700 focus:ring-2 aria-selected:ring-2 aria-selected:ring-slate-500"
                  : ""
              }`}
              aria-selected={selected}
              style={{ backgroundColor: display || `transparent` }}
              onClick={handleClick}
              tabIndex={onClick ? 0 : undefined}
              onKeyDown={
                onClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick();
                      }
                    }
                  : undefined
              }
              aria-label={
                onClick ? `Edit ${swatch.stop} color ${swatch.hex}` : undefined
              }
            />

            <PopoverPanel className="absolute top-full left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-1 pb-2 mt-1">
              <div className="flex flex-col items-center gap-4">
                <HexColorPicker
                  color={
                    colorValue.startsWith(`#`) ? colorValue : `#${colorValue}`
                  }
                  onChange={handleColorPickerChange}
                />

                <div className="flex flex-col gap-2 px-2">
                  <label
                    className={labelClasses}
                    htmlFor={`lightness-${swatch.stop}`}
                  >
                    Lightness
                  </label>
                  <input
                    id={`lightness-${swatch.stop}`}
                    className={inputClasses}
                    value={round(lightness)}
                    type="number"
                    min="0"
                    max="100"
                    onChange={handleLightnessChange}
                    name="lightness"
                  />
                </div>

                <div className="px-2 pb-2 flex justify-end">
                  <Button
                    id={`close-picker-${swatch.stop}`}
                    onClick={() => close()}
                  >
                    <XMarkIcon className="w-4 h-auto" />
                    Close
                  </Button>
                </div>
              </div>
            </PopoverPanel>
          </>
        )}
      </Popover>
      <div className="rotate-90 text-right sm:rotate-0 flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center justify-between px-1">
        <div className="font-mono">{swatch.stop}</div>
      </div>
    </div>
  );
}
