import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import * as Headless from "@headlessui/react";
import { useCopyToClipboard } from "usehooks-ts";

import { Button } from "~/components/catalyst/button";
import { MODES, VERSIONS } from "~/lib/constants";
import { output } from "~/lib/responses";
import type { Mode, PaletteConfig, Version } from "~/types";
import { Radio } from "~/components/catalyst/radio";

type OutputProps = {
  palettes: PaletteConfig[];
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
  currentVersion: Version;
  setCurrentVersion: (version: Version) => void;
};

export default function Output({
  palettes,
  currentMode,
  setCurrentMode,
  currentVersion,
  setCurrentVersion,
}: OutputProps) {
  const [, copy] = useCopyToClipboard();
  const shaped = output(palettes, currentMode);

  const displayed: string =
    currentVersion === "3"
      ? createVersion3Config(shaped)
      : createVersion4Config(shaped);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Headless.Fieldset className="flex gap-3">
          <Headless.Legend className="text-base/6 font-medium sm:text-sm/6">
            Tailwind CSS Version:
          </Headless.Legend>
          <Headless.RadioGroup
            onChange={(v) => setCurrentVersion(v as Version)}
            name="version"
            value={currentVersion}
            className="flex gap-3"
          >
            {VERSIONS.map((version) => (
              <Headless.Field key={version} className="flex items-center gap-2">
                <Radio value={version} />
                <Headless.Label className="text-base/6 select-none sm:text-sm/6 font-mono whitespace-nowrap">
                  {version}
                </Headless.Label>
              </Headless.Field>
            ))}
          </Headless.RadioGroup>
        </Headless.Fieldset>
      </div>
      <div className="flex flex-col gap-2">
        <Headless.Fieldset className="flex gap-3">
          <Headless.Legend className="text-base/6 font-medium sm:text-sm/6">
            Output color mode:
          </Headless.Legend>
          <Headless.RadioGroup
            onChange={(v) => setCurrentMode(v as Mode)}
            name="mode"
            value={currentMode}
            className="flex gap-3"
          >
            {MODES.map((mode) => (
              <Headless.Field key={mode} className="flex items-center gap-2">
                <Radio value={mode} />
                <Headless.Label className="text-base/6 select-none sm:text-sm/6 font-mono whitespace-nowrap">
                  {mode}
                </Headless.Label>
              </Headless.Field>
            ))}
          </Headless.RadioGroup>
        </Headless.Fieldset>
      </div>

      <section
        id="output"
        className="relative w-full p-4 mx-auto bg-gray-50 text-gray-800 text-sm border border-gray-200 rounded-lg overflow-scroll"
      >
        <div className="absolute right-4 top-4">
          <Button outline onClick={() => copy(displayed)}>
            <ClipboardDocumentIcon className="size-4" />
            <span className="sr-only">Copy to Clipboard</span>
          </Button>
        </div>
        <pre>{displayed}</pre>
      </section>
      <div className="prose">
        {currentVersion === "3" ? (
          <p>
            Paste this into your <code>tailwind.config.js</code> file
          </p>
        ) : (
          <p>
            Paste this into the <code>css</code> file with your Tailwind config
          </p>
        )}
      </div>
    </>
  );
}

function createVersion3Config(colors: Record<string, string>) {
  return JSON.stringify({ colors }, null, 2).replace(
    /"+[0-9]+"/g,
    function (m) {
      return m.replace(/"/g, "");
    }
  );
}

function createVersion4Config(colors: Record<string, string>) {
  return [
    `@theme {`,
    ...Object.entries(colors).map(([colorName]) =>
      Object.entries(colors[colorName])
        .map(
          ([shade, value]) =>
            `  --color-${colorName}-${shade}: ${value.toLocaleLowerCase().replace(" / <alpha-value>", "")};`
        )
        .join("\n")
    ),
    `}`,
  ].join("\n");
}
