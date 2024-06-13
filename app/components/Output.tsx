import {ClipboardDocumentIcon} from '@heroicons/react/24/solid'
import clsx from 'clsx'
import {useState} from 'react'
import {useCopyToClipboard} from 'usehooks-ts'

import ButtonIcon from '~/components/ButtonIcon'
import {VERSIONS} from '~/lib/constants'
import {output} from '~/lib/responses'
import type {Mode, PaletteConfig, Version} from '~/types'

type OutputProps = {palettes: PaletteConfig[]; mode: Mode}

export default function Output({palettes, mode}: OutputProps) {
  const [currentVersion, setCurrentVersion] = useState<Version>(VERSIONS[0])
  const [, copy] = useCopyToClipboard()
  const shaped = output(palettes, mode)

  const displayed: string =
    currentVersion === '3' ? createVersion3Config(shaped) : createVersion4Config(shaped)

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="py-2 border border-transparent">Tailwind CSS Version:</span>
        {VERSIONS.map((v) => (
          <button
            key={v}
            onClick={(e) => setCurrentVersion(v)}
            className={clsx(
              'py-2 px-4 border border-gray-200 transition-colors duration-100 font-mono',
              v === currentVersion
                ? 'bg-first-700 border-first-700 text-white'
                : 'bg-gray-50 hover:bg-first-700 hover:text-white focus-visible:bg-first-700 focus-visible:text-white',
            )}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="prose">
        {currentVersion === '3' ? (
          <p>
            Paste this into your <code>tailwind.config.js</code> file
          </p>
        ) : (
          <p>
            Paste this into the <code>css</code> file with your Tailwind config
          </p>
        )}
      </div>
      <section
        id="output"
        className="relative w-full p-4 mx-auto bg-gray-50 text-gray-800 text-sm border border-gray-200 rounded-lg overflow-scroll"
      >
        <div className="absolute right-4 top-4">
          <ButtonIcon
            onClick={() => copy(displayed)}
            title="Copy to Clipboard"
            icon={ClipboardDocumentIcon}
          />
        </div>
        <pre>{displayed}</pre>
      </section>
    </>
  )
}

function createVersion3Config(colors: Record<string, string>) {
  return JSON.stringify({colors}, null, 2).replace(/"+[0-9]+"/g, function (m) {
    return m.replace(/"/g, '')
  })
}

function createVersion4Config(colors: Record<string, string>) {
  return [
    `@theme {`,
    ...Object.entries(colors).map(([colorName]) =>
      Object.entries(colors[colorName])
        .map(
          ([shade, value]) =>
            `  --color-${colorName}-${shade}: ${value.toLocaleLowerCase().replace(' / <alpha-value>', '')};`,
        )
        .join('\n'),
    ),
    `}`,
  ].join('\n')
}
