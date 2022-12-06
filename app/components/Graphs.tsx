import {Switch} from '@headlessui/react'
import React, {useState} from 'react'

import DistributionGraph from '~/components/DistributionGraph'
import SquareGraph from '~/components/SquareGraph'
import type {PaletteConfig} from '~/types/palette'

export default function Graphs({palettes}: {palettes: PaletteConfig[]}) {
  const [hiddenValues, setHiddenValues] = useState<string[]>([])

  const handleShowHide = (value: string) => {
    if (hiddenValues.includes(value)) {
      setHiddenValues(hiddenValues.filter((v) => v !== value))
    } else {
      setHiddenValues([...hiddenValues, value])
    }
  }

  const displayPalettes =
    palettes.length === 1
      ? palettes
      : palettes.filter((palette) => !hiddenValues.includes(palette.value))

  return (
    <div className="grid grid-cols-1 gap-4">
      {palettes.length > 1 && (
        <div className="flex justify-center items-center gap-2 md:gap-4">
          {palettes.map((palette) => (
            <div key={palette.value} className="flex items-center gap-1">
              <Switch
                style={{
                  backgroundColor: hiddenValues.includes(palette.value)
                    ? undefined
                    : palette.swatches.find((swatch) => swatch.stop === 800)?.hex,
                }}
                className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200"
                checked={!hiddenValues.includes(palette.value)}
                onChange={() => handleShowHide(palette.value)}
              >
                <span className="sr-only">
                  {hiddenValues.length && hiddenValues.includes(palette.value) ? `Show` : `Hide`}{' '}
                  {palette.name}
                </span>
                <span
                  className={`${
                    hiddenValues.includes(palette.value) ? 'translate-x-1' : 'translate-x-6'
                  } transition-transform duration-200 inline-block w-4 h-4 transform bg-white rounded-full`}
                />
              </Switch>
              <span className="text-xs text-gray-600 font-bold">{palette.name}</span>
            </div>
          ))}
        </div>
      )}
      <DistributionGraph palettes={displayPalettes} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SquareGraph palettes={displayPalettes} graph="h" />
        <SquareGraph palettes={displayPalettes} graph="s" />
      </div>
    </div>
  )
}
