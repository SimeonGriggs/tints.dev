import React, {useEffect, useState} from 'react'
import {HexColorPicker} from 'react-colorful'
import {useDebounce} from 'usehooks-ts'
import {Popover} from '@headlessui/react'
import {ColorSwatchIcon, XIcon} from '@heroicons/react/solid'

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

      <Popover.Panel className="absolute right-0 z-10 bg-white shadow p-1 translate-y-1">
        {({close}) => (
          <div className="flex flex-col gap-1">
            <HexColorPicker
              color={value.startsWith(`#`) ? value : `#${value}`}
              onChange={setValue}
            />
            <button
              className="flex items-center justify-center text-xs font-bold p-2"
              type="button"
              onClick={() => close()}
            >
              <XIcon className="w-4 h-auto" />
              Close
            </button>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  )
}
