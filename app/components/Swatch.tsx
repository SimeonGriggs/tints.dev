import { DEFAULT_MODE } from "~/lib/constants";
import { createDisplayColor } from "~/lib/createDisplayColor";
import type { Mode, SwatchValue } from "~/types";

type SwatchProps = {
  swatch: SwatchValue;
  mode?: Mode;
  active?: boolean;
};

export default function Swatch(props: SwatchProps) {
  const { swatch, active = false, mode = DEFAULT_MODE } = props;

  let display = createDisplayColor(swatch.hex, mode);

  const ringStyle = { backgroundColor: display || `transparent` };

  return (
    <div className="flex-1 flex flex-col gap-2 sm:gap-1 ">
      <div
        className="h-12 xl:h-16 w-full rounded-sm flex flex-col items-center justify-center transition-colors duration-500"
        style={ringStyle}
      >
        <div
          data-active={active}
          className="size-4 rounded-full bg-white
        data-[active=true]:opacity-100 mix-blend-overlay opacity-0 duration-75 transition-opacity
        "
        />
      </div>
      <div className="rotate-90 text-right sm:rotate-0 flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center justify-center">
        <div className="font-mono">{swatch.stop}</div>
      </div>
    </div>
  );
}
