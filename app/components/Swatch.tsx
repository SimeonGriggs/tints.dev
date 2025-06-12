import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { ColorPickerContent } from "~/components/ColorPicker";
import { DEFAULT_MODE } from "~/lib/constants";
import { createDisplayColor } from "~/lib/createDisplayColor";
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

  const handleColorPickerChange = (newColor: string) => {
    setColorValue(newColor);
    debounceOnColorChange(newColor);
  };

  const ringStyle = { backgroundColor: display || `transparent` };

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
              style={ringStyle}
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

            <PopoverPanel className="absolute top-full left-1/2 -translate-x-1/2 z-50">
              <div className="bg-white rounded-lg shadow-lg p-1 pb-2 mt-1 text-base">
                <ColorPickerContent
                  color={colorValue}
                  onChange={handleColorPickerChange}
                  onClose={() => close()}
                  lightnessId={`lightness-${swatch.stop}`}
                />
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
