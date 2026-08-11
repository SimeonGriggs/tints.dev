import { Switch } from "@headlessui/react";
import { useState } from "react";

import DistributionGraph from "~/components/DistributionGraph";
import SquareGraph from "~/components/SquareGraph";
import type { Mode, PaletteConfig } from "~/types";

type GraphsProps = { palettes: PaletteConfig[]; mode: Mode };

export default function Graphs(props: GraphsProps) {
  const { palettes, mode } = props;
  const [hiddenValues, setHiddenValues] = useState<Set<string>>(
    () => new Set(),
  );

  const handleShowHide = (value: string) => {
    setHiddenValues((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const displayPalettes =
    palettes.length === 1
      ? palettes
      : palettes.filter((palette) => !hiddenValues.has(palette.value));

  return (
    <div className="grid grid-cols-1 gap-4">
      {palettes.length > 1 && (
        <div className="flex justify-center items-center gap-2 md:gap-4">
          {palettes.map((palette) => (
            <div key={palette.value} className="flex items-center gap-1">
              <Switch
                style={{
                  backgroundColor: hiddenValues.has(palette.value)
                    ? undefined
                    : palette.swatches.find((swatch) => swatch.stop === 800)
                        ?.hex,
                }}
                className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200"
                checked={!hiddenValues.has(palette.value)}
                onChange={() => handleShowHide(palette.value)}
              >
                <span className="sr-only">
                  {hiddenValues.has(palette.value) ? `Show` : `Hide`}{" "}
                  {palette.name}
                </span>
                <span
                  className={`${
                    hiddenValues.has(palette.value)
                      ? "translate-x-1"
                      : "translate-x-6"
                  } transition-transform duration-200 inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
              <span className="text-xs text-gray-600 font-bold">
                {palette.name}
              </span>
            </div>
          ))}
        </div>
      )}
      <DistributionGraph palettes={displayPalettes} mode={mode} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SquareGraph palettes={displayPalettes} graph="h" mode={mode} />
        <SquareGraph palettes={displayPalettes} graph="s" mode={mode} />
      </div>
    </div>
  );
}
