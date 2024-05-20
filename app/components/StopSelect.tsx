import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/24/solid'
import clsx from 'clsx'

import {DEFAULT_STOPS} from '~/lib/constants'

import {inputClasses} from './Palette'

type StopSelectProps = {
  value: string
  onChange: (value: string) => void
}

export default function StopSelect(props: StopSelectProps) {
  const {value, onChange} = props

  return (
    <Listbox value={value} onChange={onChange} as="div" className="relative">
      <ListboxButton
        className={clsx(inputClasses, `font-mono tabular-nums flex items-center gap-2`)}
      >
        {value}
        <ChevronDownIcon className="w-5" />
      </ListboxButton>
      <ListboxOptions
        className={clsx(
          'border border-gray-200 font-mono tabular-nums absolute z-50 w-full bg-white shadow-lg divide-y divide-gray-200 translate-y-1 focus:outline-none',
        )}
      >
        {DEFAULT_STOPS.filter((stop) => stop !== 0 && stop !== 1000).map((stop) => (
          <ListboxOption
            key={stop}
            value={stop}
            className={clsx(
              value === String(stop) ? `text-first-950 bg-first-100` : ``,
              `p-2 hover:bg-first-800 hover:text-white cursor-pointer
              data-[headlessui-state=active]:bg-first-800 data-[headlessui-state=active]:text-white transition-colors duration-100
              `,
            )}
          >
            {stop}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
