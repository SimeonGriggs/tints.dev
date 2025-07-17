import { PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useSearchParams, useNavigate, useLocation } from "react-router";

import { Button } from "~/components/catalyst/button";
import Demo from "~/components/Demo";
import Graphs from "~/components/Graphs";
import Output from "~/components/Output";
import Palette from "~/components/Palette";
import type { Block } from "~/components/Prose";
import { Prose } from "~/components/Prose";
import { MODES, VERSIONS } from "~/lib/constants";
import { createRandomPalette } from "~/lib/createRandomPalette";
import { handleMeta } from "~/lib/meta";
import type { Mode, PaletteConfig, Version } from "~/types";

import Header from "~/components/Header";
import { createDisplayColor } from "~/lib/createDisplayColor";

type GeneratorProps = {
  palettes: PaletteConfig[];
  about: Block[];
  stars: number;
};

export default function Generator({ palettes, about, stars }: GeneratorProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [palettesState, setPalettesState] = useState(palettes);
  const [showDemo, setShowDemo] = useState(false);
  const paletteRefs = useRef<HTMLDivElement[]>([]);

  // Read current mode and version from URL or use defaults
  const currentMode: Mode = (searchParams.get("output") as Mode) || MODES[0];
  const currentVersion: Version =
    (searchParams.get("version") as Version) || VERSIONS[0];

  // Helper functions to update URL parameters
  const updateMode = (mode: Mode) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("output", mode);
    navigate(`${location.pathname}?${newParams.toString()}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const updateVersion = (version: Version) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("version", version);
    navigate(`${location.pathname}?${newParams.toString()}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  // Update meta and URL on any palette state change
  useEffect(() => {
    handleMeta(palettesState, true);
  }, [palettesState]);

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

  const handleDelete = (deleteId: string) => {
    if (palettesState.length === 1) {
      return;
    }

    const updatedPalettes = palettesState.filter((p) => p.id !== deleteId);
    setPalettesState(updatedPalettes);
  };

  const styleString = useMemo(
    () =>
      palettesState.length > 0
        ? [
            `:root {`,
            ...palettesState[0].swatches.map(
              (swatch) =>
                `--first-${swatch.stop}: ${createDisplayColor(
                  swatch.hex,
                  currentMode
                )};`
            ),
            `}`,
          ].join(`\n`)
        : ``,
    [palettesState]
  );

  return (
    <main className="pb-32 pt-header">
      <style>{styleString}</style>

      <Header stars={stars} />

      {showDemo ? <Demo palettes={palettesState} close={handleDemo} /> : null}

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
                  : () => handleDelete(palette.id)
              }
              currentMode={currentMode}
            />
          </React.Fragment>
        ))}

        <section className="flex justify-center items-center gap-2">
          <Button id="demo-button" onClick={handleDemo}>
            <SparklesIcon className="size-4" />
            <span className="sr-only md:not-sr-only">Demo</span>
          </Button>
          <Button id="add-button" onClick={handleNew}>
            <PlusIcon className="size-4" />
            <span className="sr-only md:not-sr-only">Add Palette</span>
          </Button>
        </section>

        <Graphs palettes={palettesState} mode={currentMode} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="row-start-2 md:row-start-1 md:col-span-3">
            {about.length ? <Prose blocks={about} /> : null}
          </div>
          <div className="row-start-1 md:col-span-2 flex flex-col gap-4">
            <Output
              palettes={palettesState}
              currentMode={currentMode}
              setCurrentMode={updateMode}
              currentVersion={currentVersion}
              setCurrentVersion={updateVersion}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
