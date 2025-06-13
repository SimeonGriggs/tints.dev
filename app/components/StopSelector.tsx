import { createSwatches } from "~/lib/createSwatches";
import { calculateStopFromColor } from "~/lib/helpers";
import type { PaletteConfig } from "~/types";
import { Select } from "./catalyst/select";

type StopSelectorProps = {
  palette: PaletteConfig;
  current: number;
  onChange: (updatedPalette: PaletteConfig) => void;
};

export default function StopSelector({
  palette,
  current,
  onChange,
}: StopSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "auto") {
      onChange({
        ...palette,
        stopSelection: "auto",
        valueStop: calculateStopFromColor(palette.value, palette.colorMode),
        swatches: createSwatches({
          ...palette,
          stopSelection: "auto",
          valueStop: calculateStopFromColor(palette.value, palette.colorMode),
        }),
      });
    } else {
      const newStop = parseInt(value, 10);
      onChange({
        ...palette,
        stopSelection: "manual",
        valueStop: newStop,
        swatches: createSwatches({
          ...palette,
          stopSelection: "manual",
          valueStop: newStop,
        }),
      });
    }
  };

  return (
    <Select
      value={palette.stopSelection === "manual" ? palette.valueStop : "auto"}
      onChange={handleChange}
    >
      <option value="auto">
        Auto {palette.stopSelection === "manual" ? "" : `(${current})`}
      </option>
      {palette.swatches
        .filter((swatch) => ![0, 1000].includes(swatch.stop))
        .map((swatch) => (
          <option key={swatch.stop} value={swatch.stop}>
            {swatch.stop}{" "}
            {palette.stopSelection === "manual" && current === swatch.stop
              ? " (Locked)"
              : ""}
          </option>
        ))}
    </Select>
  );
}
