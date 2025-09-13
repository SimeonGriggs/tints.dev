import { Switch } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  CodeBracketIcon,
  EllipsisHorizontalIcon,
  HashtagIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState, useRef } from "react";
import { useCopyToClipboard } from "usehooks-ts";

import Graphs from "~/components/Graphs";
import Swatch from "~/components/Swatch";
import StopSelector from "~/components/StopSelector";
import { DEFAULT_PALETTE_CONFIG } from "~/lib/constants";
import { createSwatches } from "~/lib/createSwatches";
import { isHex, isValidName, calculateStopFromColor } from "~/lib/helpers";
import { createCanonicalUrl } from "~/lib/responses";
import type { ColorMode, Mode, PaletteConfig } from "~/types";

import ColorPicker from "./ColorPicker";
import { Input, InputGroup } from "./catalyst/input";
import clsx from "clsx";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./catalyst/dropdown";

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

export const labelClasses = `transition-color duration-200 text-xs font-bold `;

type PaletteProps = {
  palette: PaletteConfig;
  updateGlobal: (_updatedPalette: PaletteConfig) => void;
  deleteGlobal?: () => void;
  currentMode: Mode;
  paletteRef: (_el: HTMLDivElement) => void;
};

export default function Palette(props: PaletteProps) {
  const { palette, updateGlobal, deleteGlobal, currentMode, paletteRef } =
    props;
  const nameInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  const [paletteState, setPaletteState] = useState({
    ...DEFAULT_PALETTE_CONFIG,
    ...palette,
    swatches: palette.swatches ?? createSwatches(palette),
    stopSelection: palette.stopSelection ?? "auto",
  });
  const [showGraphs, setShowGraphs] = useState(false);
  const [, copy] = useCopyToClipboard();

  // Update global list every time local palette changes
  // ... if name and value are legit
  useEffect(() => {
    const validName = isValidName(paletteState.name) ? paletteState.name : null;
    const validValue = isHex(paletteState.value) ? paletteState.value : null;

    if (validName && validValue) {
      updateGlobal(paletteState);
    }
  }, [palette, paletteState, updateGlobal]);

  const updateName = (name: string) => {
    // Remove current search param
    if (typeof document !== "undefined" && isValidName(name)) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete(paletteState.name);
      window.history.replaceState({}, "", currentUrl.toString());
    }

    setPaletteState({
      ...paletteState,
      name,
    });
  };

  // Handle changes to name or value of palette
  const handlePaletteChange = (
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let newTargetValue = e.currentTarget.value ?? ``;

    if (e.currentTarget.name === "name") {
      if (!newTargetValue.match(/[A-Za-z]{3,24}/)) {
        nameInputRef.current?.setCustomValidity(`Invalid name`);
      } else {
        nameInputRef.current?.setCustomValidity(``);
      }
      updateName(newTargetValue);
    } else if (e.currentTarget.name === "value") {
      if (!newTargetValue.match(/[0-9A-Fa-f]{6}/)) {
        e.currentTarget.setCustomValidity(`Invalid value`);
      } else {
        e.currentTarget.setCustomValidity(``);
      }
      newTargetValue = newTargetValue.replace("#", ""); // Remove eventual hashes

      if (isHex(newTargetValue)) {
        const newPalette = {
          ...paletteState,
          value: newTargetValue,
          valueStop:
            paletteState.stopSelection === "manual"
              ? paletteState.valueStop // Keep current stop in manual mode
              : calculateStopFromColor(newTargetValue, paletteState.colorMode),
        };
        setPaletteState({
          ...newPalette,
          swatches: createSwatches(newPalette),
        });
      } else {
        // Update value without swatches if invalid
        setPaletteState({
          ...paletteState,
          value: newTargetValue,
        });
      }
    }
  };

  // Handle any changes to the tweaks values
  const handleTweakChange = (e: React.FormEvent<HTMLInputElement>) => {
    const tweakName = e.currentTarget.name;
    const newTweakValue = e.currentTarget.value
      ? parseInt(e.currentTarget.value, 10)
      : ``;

    const newPalette = {
      ...paletteState,
      [tweakName]: newTweakValue,
    };

    // Don't update swatches if the new value is invalid
    if (!String(newTweakValue)) {
      setPaletteState(newPalette);
      return;
    }

    setPaletteState({
      ...newPalette,
      swatches: createSwatches(newPalette),
    });
  };

  // Handle toggle between linear and perceived modes
  const handleColorModeChange = () => {
    const newColorMode: ColorMode =
      paletteState.colorMode === "linear" ? "perceived" : "linear";
    const newPalette: PaletteConfig = {
      ...paletteState,
      colorMode: newColorMode,
    };

    setPaletteState({
      ...newPalette,
      swatches: createSwatches(newPalette),
    });
  };

  const handleCopyURL = useCallback(() => {
    const shareUrl = createCanonicalUrl([paletteState]);
    copy(shareUrl);
  }, [paletteState, copy]);

  const handleOpenAPI = () => {
    if (typeof document !== "undefined") {
      const apiUrl = createCanonicalUrl([paletteState], true);

      window.open(apiUrl, "_blank");
    }
  };

  // Handle change from color picker widget (debounced)
  const handleColorPickerChange = (newColor: string) => {
    if (newColor && isHex(newColor)) {
      const hexWithoutHash = newColor.replace("#", "").toUpperCase();
      const newPalette = {
        ...paletteState,
        value: hexWithoutHash,
        valueStop:
          paletteState.stopSelection === "manual"
            ? paletteState.valueStop // Keep current stop in manual mode
            : calculateStopFromColor(hexWithoutHash, paletteState.colorMode),
      };
      setPaletteState({
        ...newPalette,
        swatches: createSwatches(newPalette),
      });
    }
  };

  const ringStyle = {
    "--tw-ring-color": palette.swatches[1].hex,
  } as React.CSSProperties;

  return (
    <article
      ref={paletteRef}
      id={`s-${palette.value}`}
      className="grid grid-cols-1 gap-4 text-gray-500"
    >
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        <div className="grid col-span-2 focus-within:text-blue-900 grid-rows-[auto] grid-cols-1 gap-y-1">
          <label className={clsx(labelClasses, "col-span-2")} htmlFor="name">
            Name
          </label>
          <div className="relative">
            <InputGroup>
              <Input
                ref={nameInputRef}
                id={`name-${paletteState.id}`}
                name="name"
                value={String(paletteState.name)}
                onChange={handlePaletteChange}
                pattern="[A-Za-z]{3,24}"
                min={3}
                max={24}
                required
                invalid={!isValidName(paletteState.name)}
              />
            </InputGroup>
          </div>
        </div>
        <div className="grid col-span-2 focus-within:text-blue-900 grid-rows-[auto] grid-cols-[1fr_auto] gap-1">
          <label className={clsx(labelClasses, "col-span-2")} htmlFor="value">
            Value
          </label>
          <div className="relative">
            <InputGroup>
              <HashtagIcon className="size-4" />
              <Input
                ref={valueInputRef}
                id={`value-${paletteState.id}`}
                name="value"
                value={String(paletteState.value)}
                onChange={handlePaletteChange}
                pattern="[0-9A-Fa-f]{6}"
                min={6}
                max={6}
                required
                invalid={!isHex(paletteState.value)}
              />
            </InputGroup>
          </div>
          <ColorPicker
            color={paletteState.value}
            onChange={handleColorPickerChange}
            ringStyle={ringStyle}
          />
        </div>
        <div className="col-span-4 sm:col-span-1 flex justify-between items-end gap-2">
          <StopSelector
            current={paletteState.valueStop}
            palette={paletteState}
            onChange={(updatedPalette) => setPaletteState(updatedPalette)}
          />
          <Dropdown>
            <DropdownButton outline>
              <EllipsisHorizontalIcon className="size-4" />
              <span className="sr-only">Options</span>
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem onClick={handleCopyURL}>
                <LinkIcon className="size-4" />
                Copy URL
              </DropdownItem>
              <DropdownItem onClick={handleOpenAPI}>
                <CodeBracketIcon className="size-4" />
                Open API
              </DropdownItem>
              <DropdownItem onClick={() => setShowGraphs(!showGraphs)}>
                {" "}
                <AdjustmentsHorizontalIcon className="size-4" />
                {showGraphs ? "Hide" : "Show"} Graphs
              </DropdownItem>
              <DropdownItem
                onClick={() => deleteGlobal?.()}
                disabled={!deleteGlobal}
              >
                <TrashIcon className="size-4" />
                Delete Palette
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
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
              onChange={handleTweakChange}
              name={input.name}
              value={paletteState[input.name] ?? input.value}
              type="number"
              required
            />
          </div>
        ))}
        <div className="col-span-4 sm:col-span-1 p-2 flex justify-center items-center gap-1 border border-dashed border-gray-200">
          <span
            className={[
              labelClasses,
              paletteState.colorMode === "perceived" ? `` : `text-gray-900`,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="inline lg:hidden">Pe</span>
            <span className="hidden lg:inline">Perceived</span>
          </span>
          <Switch
            checked={paletteState.colorMode === "linear"}
            onChange={handleColorModeChange}
            style={{
              backgroundColor:
                paletteState.colorMode === "linear"
                  ? paletteState.swatches.find((swatch) => swatch.stop === 800)
                      ?.hex
                  : paletteState.swatches.find((swatch) => swatch.stop === 300)
                      ?.hex,
            }}
            className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200 shrink-0"
          >
            <span className="sr-only">
              Toggle between Linear and Perceived modes
            </span>
            <span
              className={`${
                paletteState.colorMode === "linear"
                  ? "translate-x-6"
                  : "translate-x-1"
              } transition-transform duration-200 inline-block w-4 h-4 transform bg-white rounded-full`}
            />
          </Switch>
          <span
            className={[
              labelClasses,
              paletteState.colorMode === "linear" ? `text-gray-900` : ``,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="inline lg:hidden">Li</span>
            <span className="hidden lg:inline">Linear</span>
          </span>
        </div>
      </div>
      <div className="grid gap-1 grid-cols-11 sm:grid-cols-4 lg:grid-cols-11 sm:gap-2 text-2xs sm:text-xs">
        {paletteState.swatches
          .filter((swatch) => ![0, 1000].includes(swatch.stop))
          .map((swatch) => (
            <Swatch
              active={swatch.stop === paletteState.valueStop}
              key={swatch.stop}
              swatch={swatch}
              mode={currentMode}
              stopSelection={paletteState.stopSelection}
              onClick={(clickedSwatch) => {
                setPaletteState({
                  ...paletteState,
                  value: clickedSwatch.hex.replace("#", ""),
                  valueStop: clickedSwatch.stop,
                  stopSelection: "manual",
                  swatches: createSwatches({
                    ...paletteState,
                    value: clickedSwatch.hex.replace("#", ""),
                    valueStop: clickedSwatch.stop,
                    stopSelection: "manual",
                  }),
                });
              }}
            />
          ))}
      </div>
      {showGraphs && <Graphs palettes={[paletteState]} mode={currentMode} />}
    </article>
  );
}
