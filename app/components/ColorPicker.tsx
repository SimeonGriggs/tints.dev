import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { SwatchIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDebounceCallback } from "usehooks-ts";

import { Button } from "~/components/catalyst/button";
import { labelClasses } from "~/components/Palette";
import { hexToHSL, HSLToHex, round } from "~/lib/helpers";
import { Input } from "./catalyst/input";

// Reusable color picker content component
export function ColorPickerContent({
  color,
  onChange,
  onClose,
  lightnessId = "lightness",
}: {
  color: string;
  onChange: (value: string) => void;
  onClose?: () => void;
  lightnessId?: string;
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
    [h, s, setValue, debounceOnChange],
  );

  return (
    <div className="flex flex-col items-justify-center gap-4">
      <HexColorPicker
        color={value.startsWith(`#`) ? value : `#${value}`}
        onChange={(value) => {
          setValue(value);
          debounceOnChange(value);
        }}
      />

      <div className="flex flex-col gap-2 px-2">
        <label className={labelClasses} htmlFor={lightnessId}>
          Lightness
        </label>
        <Input
          id={lightnessId}
          value={round(lightness)}
          type="number"
          min="0"
          max="100"
          onChange={handleLightnessChange}
          name="lightness"
        />
      </div>

      {onClose && (
        <div className="px-2 pb-2 flex justify-end">
          <Button id="closePicker" onClick={onClose}>
            <XMarkIcon className="size-4" />
            Close
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ColorPicker({
  color,
  onChange,
  buttonContent,
  panelClassName = "absolute right-0 z-50 bg-white shadow-lg rounded-lg p-1 pb-2 translate-y-1",
  children,
}: {
  color: string;
  onChange: (_value: string) => void;
  ringStyle: React.CSSProperties;
  buttonContent?: React.ReactNode;
  buttonClassName?: string;
  panelClassName?: string;
  children?: React.ReactNode;
}) {
  const defaultButtonContent = (
    <>
      <SwatchIcon className="size-6" />
      <span className="sr-only">Open Color Picker</span>
    </>
  );

  return (
    <Popover className="relative">
      <PopoverButton as="div">
        <Button outline>{buttonContent || defaultButtonContent}</Button>
      </PopoverButton>

      <PopoverPanel className={panelClassName}>
        {({ close }) => (
          <>
            <ColorPickerContent
              color={color}
              onChange={onChange}
              onClose={() => close()}
            />
            {children}
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
}
