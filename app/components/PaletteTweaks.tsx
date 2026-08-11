import { Switch } from "@headlessui/react";

import { Input } from "~/components/catalyst/input";
import { labelClasses } from "~/components/formStyles";
import { DEFAULT_PALETTE_CONFIG } from "~/lib/constants";
import type { PaletteConfig } from "~/types";

const tweakInputs = [
  {
    name: `h`,
    title: `Hue`,
    value: DEFAULT_PALETTE_CONFIG.h,
  },
  {
    name: `s`,
    title: `Saturation`,
    value: DEFAULT_PALETTE_CONFIG.s,
  },
  {
    name: `lMax`,
    title: `Lightness Maximum`,
    value: DEFAULT_PALETTE_CONFIG.lMax,
  },
  {
    name: `lMin`,
    title: `Lightness Minimum`,
    value: DEFAULT_PALETTE_CONFIG.lMin,
  },
] as const;

type PaletteTweaksProps = {
  palette: PaletteConfig;
  onTweakChange: (e: React.FormEvent<HTMLInputElement>) => void;
  onColorModeChange: () => void;
};

export default function PaletteTweaks({
  palette,
  onTweakChange,
  onColorModeChange,
}: PaletteTweaksProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
      {tweakInputs.map((input) => (
        <div
          key={input.name}
          className="flex flex-col gap-1 justify-between focus-within:text-gray-900"
        >
          <label className={labelClasses} htmlFor={input.name}>
            {input.title}
          </label>
          <Input
            id={input.name}
            onChange={onTweakChange}
            name={input.name}
            value={palette[input.name] ?? input.value}
            type="number"
            required
          />
        </div>
      ))}
      <div className="col-span-4 sm:col-span-1 p-2 flex justify-center items-center gap-1 border border-dashed border-gray-200">
        <span
          className={[
            labelClasses,
            palette.colorMode === "perceived" ? `` : `text-gray-900`,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="inline lg:hidden">Pe</span>
          <span className="hidden lg:inline">Perceived</span>
        </span>
        <Switch
          checked={palette.colorMode === "linear"}
          onChange={onColorModeChange}
          style={{
            backgroundColor:
              palette.colorMode === "linear"
                ? palette.swatches.find((swatch) => swatch.stop === 800)?.hex
                : palette.swatches.find((swatch) => swatch.stop === 300)?.hex,
          }}
          className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200 shrink-0"
        >
          <span className="sr-only">
            Toggle between Linear and Perceived modes
          </span>
          <span
            className={`${
              palette.colorMode === "linear" ? "translate-x-6" : "translate-x-1"
            } transition-transform duration-200 inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
        <span
          className={[
            labelClasses,
            palette.colorMode === "linear" ? `text-gray-900` : ``,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="inline lg:hidden">Li</span>
          <span className="hidden lg:inline">Linear</span>
        </span>
      </div>
    </div>
  );
}
