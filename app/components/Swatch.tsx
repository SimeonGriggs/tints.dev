import React from 'react'

import {SwatchValue} from '~/types/SwatchValue'

export default function Swatch({swatch}: {swatch: SwatchValue}) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <div
        className="h-12 xl:h-16 w-full rounded shadow-inner flex flex-col items-center justify-center transition-colors duration-500"
        style={{backgroundColor: swatch.hex}}
      />
      <div className="flex items-center justify-between px-0.5 sm:px-1">
        <div className="font-mono">{swatch.stop}</div>
        <div className="tabular-nums opacity-50">{swatch.hex.toUpperCase()}</div>
      </div>
    </div>
  )
}
