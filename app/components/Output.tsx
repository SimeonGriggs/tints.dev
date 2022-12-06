import {ClipboardDocumentIcon} from '@heroicons/react/24/solid'
import {useCopyToClipboard} from 'usehooks-ts'

import {output} from '~/lib/responses'
import type {PaletteConfig} from '~/types/palette'

import ButtonIcon from './ButtonIcon'

export default function Output({palettes}: {palettes: PaletteConfig[]}) {
  const [, copy] = useCopyToClipboard()
  const shaped = output(palettes)

  const displayed = JSON.stringify({colors: shaped}, null, 2).replace(/"+[0-9]+"/g, function (m) {
    return m.replace(/"/g, '')
  })

  return (
    <section
      id="output"
      className="relative w-full p-4 mx-auto bg-gray-50 text-gray-800 text-sm border border-gray-200 rounded-lg"
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
  )
}
