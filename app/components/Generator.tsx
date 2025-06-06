import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import isEqual from "react-fast-compare";

import Demo from "~/components/Demo";
import Graphs from "~/components/Graphs";
import Output from "~/components/Output";
import Palette from "~/components/Palette";
import type { Block } from "~/components/Prose";
import { Prose } from "~/components/Prose";
import { MODES } from "~/lib/constants";
import { createRandomPalette } from "~/lib/createRandomPalette";
import { arrayObjectDiff } from "~/lib/helpers";
import { convertParamsToPath, removeSearchParamByKey } from "~/lib/history";
import { usePrevious } from "~/lib/hooks";
import { handleMeta } from "~/lib/meta";
import type { Mode, PaletteConfig } from "~/types";

import Header from "~/components/Header";

type GeneratorProps = {
  palettes: PaletteConfig[];
  about: Block[];
  stars: number;
};

export default function Generator({ palettes, about, stars }: GeneratorProps) {
  const [palettesState, setPalettesState] = useState(palettes);
  const [showDemo, setShowDemo] = useState(false);
  const [currentMode, setCurrentMode] = useState<Mode>(MODES[0]);
  const previousPalettes: undefined | PaletteConfig[] =
    usePrevious(palettesState);
  const paletteRefs = useRef<HTMLDivElement[]>([]);

  // Maybe update document meta on each state change
  // Initially it seemed like a good idea to handle this globally as a side-effect
  // ...but now I'm less sure
  useEffect(() => {
    // Only update meta if the `name` or `value` changed between renders
    // Or if it's the first render

    // TODO: Don't update title if pathname was `/` and palette is random
    const keysChanged = previousPalettes
      ? arrayObjectDiff(previousPalettes, palettesState)
      : [];

    if (
      !previousPalettes ||
      keysChanged.includes(`value`) ||
      keysChanged.includes(`name`)
    ) {
      // Only update history if the `value` changed
      handleMeta(palettesState, keysChanged.includes(`value`));
    }
  }, [palettesState, previousPalettes]);

  const handleNew = () => {
    setPalettesState((prev) => {
      const currentValues = prev.map((p) => p.value);
      const randomPalette = createRandomPalette(currentValues);
      return [...prev, randomPalette];
    });

    paletteRefs.current.at(-1)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDemo = () => setShowDemo(!showDemo);

  const handleUpdate = (palette: PaletteConfig, index: number) => {
    const currentPalettes = [...palettesState];
    currentPalettes[index] = palette;

    if (!isEqual(currentPalettes, palettesState)) {
      setPalettesState(currentPalettes);
    }
  };

  const handleDelete = (deleteId: string, deleteName: string) => {
    if (palettesState.length === 1) {
      return;
    }

    const updatedPalettes = palettesState.filter((p) => p.id !== deleteId);

    if (updatedPalettes.length === 1) {
      // Switch from query params to path
      convertParamsToPath(updatedPalettes);
    } else {
      // Update query params
      removeSearchParamByKey(deleteName);
    }

    setPalettesState(updatedPalettes);
  };

  const styleString = useMemo(
    () =>
      [
        `:root {`,
        ...palettesState[0].swatches.map(
          (swatch) => `--first-${swatch.stop}: ${swatch.hex};`,
        ),
        `}`,
      ].join(`\n`),
    [palettesState],
  );

  return (
    <main className="pb-32 pt-header">
      <style>{styleString}</style>

      <Header handleNew={handleNew} handleDemo={handleDemo} stars={stars} />

      {showDemo ? <Demo palettes={palettesState} close={handleDemo} /> : null}

      <div className="container p-4 mx-auto flex items-center justify-start gap-2">
        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => setCurrentMode(mode)}
            className={clsx(
              "py-2 px-4 border border-gray-200 transition-colors duration-100 font-mono",
              mode === currentMode
                ? "bg-first-700 border-first-700 text-white"
                : "bg-gray-50 hover:bg-first-700 hover:text-white focus-visible:bg-first-700 focus-visible:text-white",
            )}
          >
            {mode}
          </button>
        ))}
        <div className="ml-auto text-right">
          <div className="px-4 py-2 border-gray-200 border border-dotted text-sm text-first-500 font-bold">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/simeongriggs"
            >
              🤙 Sponsor tints.dev
            </a>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 p-4 gap-y-12 container mx-auto">
        {palettesState.map((palette: PaletteConfig, index: number) => (
          <React.Fragment key={palette.id}>
            <Palette
              paletteRef={(el) => (paletteRefs.current[index] = el)}
              palette={palette}
              updateGlobal={(updatedPalette: PaletteConfig) =>
                handleUpdate(updatedPalette, index)
              }
              deleteGlobal={
                palettesState.length <= 1
                  ? undefined
                  : () => handleDelete(palette.id, palette.name)
              }
              currentMode={currentMode}
            />
            <div className="border-t border-gray-200" />
          </React.Fragment>
        ))}

        <Graphs palettes={palettesState} mode={currentMode} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="row-start-2 md:row-start-1 md:col-span-3">
            {about.length ? <Prose blocks={about} /> : null}
          </div>
          <div className="row-start-1 md:col-span-2 flex flex-col gap-4">
            <Output palettes={palettesState} mode={currentMode} />
          </div>
        </div>
      </section>
    </main>
  );
}
