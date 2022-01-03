import React, {useEffect, useState} from 'react'
import {HexColorPicker} from 'react-colorful'
import {useDebounce} from 'usehooks-ts'
import {Popover} from '@headlessui/react'
import {ColorSwatchIcon, XIcon} from '@heroicons/react/solid'
import Button from './Button'

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
  useEffect(() => setValue(color), [color])

  // Update global `value` on picker change
  useEffect(() => (value ? onChange(value.toUpperCase()) : null), [debouncedValue])

  return (
    <Popover className="relative">
      <Popover.Button
        style={ringStyle}
        className="w-full p-2 border border-gray-200 bg-gray-50 focus:outline-none focus:ring focus:bg-gray-100 focus:border-gray-300 text-gray-500 focus:text-gray-900"
      >
        <ColorSwatchIcon className="w-6 h-auto" />
        <span className="sr-only">Open Color Picker</span>
      </Popover.Button>

      <Popover.Panel className="absolute right-0 z-50 bg-white rounded-lg shadow p-1 pb-2 translate-y-1">
        {({close}) => (
          <div className="flex flex-col items-center justify-center gap-2">
            <HexColorPicker
              color={value.startsWith(`#`) ? value : `#${value}`}
              onChange={setValue}
            />

            <Button id="closePicker" onClick={() => close()}>
              <XIcon className="w-4 h-auto" />
              Close Picker
            </Button>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  )
}
