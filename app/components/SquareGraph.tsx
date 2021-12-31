import React from 'react'
import {PaletteConfig} from '~/types/palette'

const labels = {
  h: 'Hue',
  s: 'Saturation',
}

export default function SquareGraph({
  palettes,
  graph = `h`,
}: {
  palettes: PaletteConfig[]
  graph: 'h' | 's'
}) {
  return (
    <section className="grid grid-cols-1 gap-2">
      <div className="relative rounded bg-gray-50 border border-gray-200 flex justify-between h-40 w-full">
        {palettes.map((palette) => (
          <React.Fragment key={palette.value}>
            {palette.swatches.map((swatch) => {
              const scaleValue = swatch[`${graph}Scale`]
              const limitedScale =
                scaleValue > 0 ? Math.min(scaleValue, 50) : Math.max(scaleValue, -50)

              return (
                <div
                  key={swatch.stop}
                  style={{
                    backgroundColor: swatch.hex,
                    transitionDelay: `${swatch.stop / 2}ms`,
                    top: `calc(50% - ${limitedScale}%)`,
                    left: `${100 - swatch.l}%`,
                  }}
                  className="transition duration-500 absolute z-10 border-2 border-white shadow rounded-full transform -translate-y-1/2 -translate-x-1/2 w-5 h-5"
                />
              )
            })}
          </React.Fragment>
        ))}
        <div
          className="absolute inset-0 border-t border-gray-200"
          style={{top: '50%', height: '50%'}}
        />
        <div className="absolute p-2 bottom-0 left-0 font-bold text-xs text-gray-400">-</div>
        <div className="absolute p-2 bottom-0 left-0 right-0 text-center font-bold text-xs text-gray-400">
          {/* eslint-disable-next-line no-nested-ternary */}
          {palettes.length > 1
            ? `Lightness/Luminance`
            : palettes[0].useLightness
            ? `Lightness`
            : `Luminance`}
        </div>

        <div className="absolute flex justify-center items-center h-full w-6 font-bold text-xs text-gray-400">
          <span className="transform -rotate-90">{labels[graph]}</span>
        </div>

        <div className="absolute p-2 top-0 left-0 font-bold text-xs text-gray-400">+</div>
        <div className="border-transparent h-full border-l" />
        <div className="border-gray-200 border-dashed h-full border-l" />
        <div className="border-gray-200 border-dashed h-full border-l" />
        <div className="border-gray-200 border-dashed h-full border-l" />
        <div className="border-gray-200 border-dashed h-full border-l" />
        <div className="border-gray-200 h-full border-l" />
        <div className="border-gray-200 border-dashed h-full border-l" />
        <div className="border-gray-200 border-dashed h-full border-l" />
        <div className="border-gray-200 border-dashed h-full border-l" />
        <div className="border-gray-200 border-dashed h-full border-l" />
        <div className="border-transparent h-full border-l" />
      </div>
      <div className="text-lg font-medium text-center">
        <h2>{labels[graph]} Shift</h2>
      </div>
    </section>
  )
}
