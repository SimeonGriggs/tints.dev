import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { SwatchIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDebounceCallback } from "usehooks-ts";

import Button from "~/components/Button";
import { inputClasses, labelClasses } from "~/components/Palette";
import { hexToHSL, HSLToHex, round } from "~/lib/helpers";

export default function ColorPicker({
  color,
  onChange,
  ringStyle,
}: {
  color: string;
  onChange: (_value: string) => void;
  ringStyle: React.CSSProperties;
}) {
  const [value, setValue] = useState(color);
  const debounceOnChange = useDebounceCallback(onChange, 500);
  const { h, s, l: lightness } = hexToHSL(value);

  const handleLightnessChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLightness = Number(e.target.value);

      if (newLightness < 0 || newLightness > 100) {
        return;
      }

      const newValue = HSLToHex(h, s, newLightness);
      setValue(newValue);
      debounceOnChange(newValue);
    },
    [h, s, setValue, debounceOnChange]
  );

  return (
    <Popover className="relative">
      <PopoverButton
        style={ringStyle}
        className="w-full p-2 border border-gray-200 bg-gray-50 focus:outline-hidden focus:ring-3 focus:bg-gray-100 focus:border-gray-300 text-gray-500 focus:text-gray-900"
      >
        <SwatchIcon className="w-6 h-auto" />
        <span className="sr-only">Open Color Picker</span>
      </PopoverButton>

      <PopoverPanel className="absolute right-0 z-50 bg-white rounded-lg p-1 pb-2 translate-y-1">
        {({ close }) => (
          <div className="flex flex-col items-justify-center gap-4">
            <HexColorPicker
              color={value.startsWith(`#`) ? value : `#${value}`}
              onChange={(value) => {
                setValue(value);
                debounceOnChange(value);
              }}
            />

            <div className="flex flex-col gap-2 px-2">
              <label className={labelClasses} htmlFor="lightness">
                Lightness
              </label>
              <input
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
              <Button id="closePicker" onClick={() => close()}>
                <XMarkIcon className="w-4 h-auto" />
                Close
              </Button>
            </div>
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
}
