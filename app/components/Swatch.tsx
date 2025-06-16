import { DEFAULT_MODE } from "~/lib/constants";
import { createDisplayColor } from "~/lib/createDisplayColor";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import type { Mode, SwatchValue } from "~/types";

type SwatchProps = {
  swatch: SwatchValue;
  mode?: Mode;

  active?: boolean;
  onClick?: (swatch: SwatchValue) => void;
  stopSelection?: "auto" | "manual";
};

export default function Swatch(props: SwatchProps) {
  const {
    swatch,
    active = false,
    mode = DEFAULT_MODE,
    onClick,
    stopSelection = "auto",
  } = props;

  let display = createDisplayColor(swatch.hex, mode);

  const ringStyle = { backgroundColor: display || `transparent` };

  return (
    <div className="flex-1 flex flex-col gap-2 sm:gap-1">
      <div
        className="h-12 xl:h-16 w-full rounded-sm flex flex-col items-center justify-center transition-colors duration-500 cursor-pointer hover:ring-2 hover:ring-gray-200"
        style={ringStyle}
        onClick={() => onClick?.(swatch)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick?.(swatch);
          }
        }}
      >
        <div data-active={active} className="text-white">
          {active &&
            (stopSelection === "manual" ? (
              <LockClosedIcon className="size-5" />
            ) : (
              <LockOpenIcon className="size-5" />
            ))}
        </div>
      </div>
      <div className="rotate-90 text-right sm:rotate-0 flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center justify-center">
        <div className="font-mono">{swatch.stop}</div>
      </div>
    </div>
  );
}
