import {Popover} from '@headlessui/react'
import {SwatchIcon, XMarkIcon} from '@heroicons/react/24/solid'
import React, {useCallback, useEffect, useState} from 'react'
import {HexColorPicker} from 'react-colorful'
import {useDebounce} from 'usehooks-ts'

import {HSLToHex, hexToHSL, round} from '~/lib/helpers'

import Button from './Button'
import {inputClasses, labelClasses} from './Palette'

export default function ColorPicker({
  color,
  onChange,
  ringStyle,
}: {
  color: string
  onChange: Function
  ringStyle: React.CSSProperties
}) {
  const [value, setValue] = useState<string>(color)
  const debouncedValue = useDebounce<string>(value, 500)

  // Update local `value` on form change
  useEffect(() => {
    setValue(color)
  }, [color])

  // Update global `value` on picker change
  useEffect(() => {
    if (value) {
      onChange(value.toUpperCase())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  const {h, s, l: lightness} = hexToHSL(value)
  const handleLightnessChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLightness = Number(e.target.value)

      if (newLightness < 0 || newLightness > 100) {
        return
      }

      const newValue = HSLToHex(h, s, newLightness)
      setValue(newValue)
    },
    [h, s]
  )

  return (
    <Popover className="relative">
      <Popover.Button
        style={ringStyle}
        className="w-full p-2 border border-gray-200 bg-gray-50 focus:outline-none focus:ring focus:bg-gray-100 focus:border-gray-300 text-gray-500 focus:text-gray-900"
      >
        <SwatchIcon className="w-6 h-auto" />
        <span className="sr-only">Open Color Picker</span>
      </Popover.Button>

      <Popover.Panel className="absolute right-0 z-50 bg-white rounded-lg shadow p-1 pb-2 translate-y-1">
        {({close}) => (
          <div className="flex flex-col items-justify-center gap-4">
            <HexColorPicker
              color={value.startsWith(`#`) ? value : `#${value}`}
              onChange={setValue}
            />

            <div className="flex flex-col gap-2 px-2">
              <label className={labelClasses} htmlFor="lightness">
                Lightness
              </label>
              <input
                className={inputClasses}
                value={round(lightness)}
                type="number"
                min="0"
                max="100"
                onChange={handleLightnessChange}
                name="lightness"
              />
            </div>

            <div className="px-2 pb-2 flex justify-end">
              <Button id="closePicker" onClick={() => close()}>
                <XMarkIcon className="w-4 h-auto" />
                Close
              </Button>
            </div>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  )
}
