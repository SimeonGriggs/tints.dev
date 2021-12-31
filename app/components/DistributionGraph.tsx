import React from 'react'

import {PaletteConfig} from '~/types/palette'

const graphHeight = 40

export default function DistributionGraph({palettes}: {palettes: PaletteConfig[]}) {
  return (
    <section className="grid grid-cols-1 gap-2">
      <div className="text-lg font-medium text-center">
        <h2>Lightness/Luminance Distribution 0-100</h2>
      </div>

      <div
        style={{height: graphHeight * palettes.length}}
        className="relative rounded bg-gray-800 flex justify-between h-full overflow-hidden"
      >
        {palettes.map((palette, index) => (
          <React.Fragment key={palette.value}>
            {palette.swatches.map((swatch) => (
              <div
                key={swatch.stop}
                style={{
                  backgroundColor: swatch.hex,
                  transitionDelay: `${swatch.stop / 2}ms`,
                  top: (index + 1) * graphHeight - graphHeight / 2,
                  left: `${100 - swatch.l}%`,
                }}
                className="transition duration-500 absolute z-10 border-2 border-white shadow rounded-full transform -translate-y-1/2 -translate-x-1/2 w-5 h-5"
              />
            ))}
          </React.Fragment>
        ))}
        <div className="absolute p-2 leading-none bottom-0 left-0 text-gray-100 text-xs font-bold">
          100 (White)
        </div>
        <div className="absolute p-2 leading-none bottom-0 right-0 text-gray-100 text-xs font-bold">
          0 (Black)
        </div>
        <div
          className="absolute inset-0 border-t border-gray-700"
          style={{top: '50%', height: '50%'}}
        />
        <div className="border-transparent h-full border-l" />
        <div className="border-gray-700 h-full border-l border-dashed" />
        <div className="border-gray-700 h-full border-l border-dashed" />
        <div className="border-gray-700 h-full border-l border-dashed" />
        <div className="border-gray-700 h-full border-l border-dashed" />
        <div className="border-gray-700 h-full border-l" />
        <div className="border-gray-700 h-full border-l border-dashed" />
        <div className="border-gray-700 h-full border-l border-dashed" />
        <div className="border-gray-700 h-full border-l border-dashed" />
        <div className="border-gray-700 h-full border-l border-dashed" />
        <div className="border-transparent h-full border-l" />
      </div>
    </section>
  )
}
