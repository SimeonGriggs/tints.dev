import React from 'react'
import {usePopperTooltip} from 'react-popper-tooltip'

import type {SwatchValue} from '~/types/SwatchValue'

const dotClasses = {
  common: `transition duration-500 absolute z-10 border-2 border-white shadow transform -translate-y-1/2 -translate-x-1/2`,
  default: `rounded-full w-4 h-4`,
  '500': `rotate-45 w-5 h-5`,
  ends: `w-1 h-6`,
}

export default function Dot({
  swatch,
  top,
  highlight = 'l',
}: {
  swatch: SwatchValue
  top: number | string
  highlight: 'h' | 's' | 'l'
}) {
  const {getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible} = usePopperTooltip()

  const classNames = [dotClasses.common]

  if (swatch.stop === 500) {
    classNames.push(dotClasses['500'])
  } else if (swatch.stop === 0 || swatch.stop === 1000) {
    classNames.push(dotClasses.ends)
  } else {
    classNames.push(dotClasses.default)
  }

  return (
    <>
      <div
        ref={setTriggerRef}
        style={{
          backgroundColor: swatch.hex,
          left: `${100 - swatch.l}%`,
          top,
        }}
        className={classNames.join(' ')}
      />
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: `w-20 text-center z-50 bg-white p-2 rounded shadow text-xs md:text-sm font-mono`,
          })}
        >
          <div
            {...getArrowProps({
              className: `absolute bottom-full bg-white h-2 w-4 pointer-events-none`,
              style: {clipPath: `polygon(50% 0%, 0% 100%, 100% 100%)`},
            })}
          />
          {[0, 1000].includes(swatch.stop) ? (
            `"${swatch.stop}"`
          ) : (
            <span className="flex flex-col">
              <span className="text-gray-900">{swatch.stop}</span>
              <span className="text-gray-600">
                {highlight.toUpperCase()}:{swatch[highlight]}
              </span>
            </span>
          )}
        </div>
      )}
    </>
  )
}
