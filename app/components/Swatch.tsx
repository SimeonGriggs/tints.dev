import React from 'react'

import type {SwatchValue} from '~/types/SwatchValue'

export default function Swatch({swatch}: {swatch: SwatchValue}) {
  return (
    <div className="flex-1 flex flex-col sm:gap-1">
      <div
        className="h-12 xl:h-16 w-full rounded shadow-inner flex flex-col items-center justify-center transition-colors duration-500"
        style={{backgroundColor: swatch.hex}}
      />
      <div className="rotate-90 text-right sm:rotate-0 flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center justify-between px-1">
        <div className="font-mono">{swatch.stop}</div>
        <div className="hidden sm:block tabular-nums opacity-50">{swatch.hex.toUpperCase()}</div>
      </div>
    </div>
  )
}
