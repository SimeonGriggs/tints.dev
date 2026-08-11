import Swatch from "~/components/Swatch";
import { createSwatches } from "~/lib/createSwatches";
import type { Mode, PaletteConfig, SwatchValue } from "~/types";

type PaletteSwatchGridProps = {
  palette: PaletteConfig;
  currentMode: Mode;
  onCommit: (next: PaletteConfig) => void;
};

export default function PaletteSwatchGrid({
  palette,
  currentMode,
  onCommit,
}: PaletteSwatchGridProps) {
  const handleSwatchClick = (clickedSwatch: SwatchValue) => {
    const value = clickedSwatch.hex.replace("#", "");
    const next = {
      ...palette,
      value,
      valueStop: clickedSwatch.stop,
      stopSelection: "manual" as const,
    };
    onCommit({
      ...next,
      swatches: createSwatches(next),
    });
  };

  return (
    <div className="grid gap-1 grid-cols-11 sm:grid-cols-4 lg:grid-cols-11 sm:gap-2 text-2xs sm:text-xs">
      {palette.swatches.flatMap((swatch) => {
        if (swatch.stop === 0 || swatch.stop === 1000) {
          return [];
        }
        return [
          <Swatch
            active={swatch.stop === palette.valueStop}
            key={swatch.stop}
            swatch={swatch}
            mode={currentMode}
            stopSelection={palette.stopSelection}
            onClick={handleSwatchClick}
          />,
        ];
      })}
    </div>
  );
}
