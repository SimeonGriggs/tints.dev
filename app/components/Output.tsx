import {ClipboardCopyIcon} from '@heroicons/react/solid'
import {useCopyToClipboard} from 'usehooks-ts'

import ButtonIcon from './ButtonIcon'
import {PaletteConfig} from '~/types/palette'
import {output} from '~/lib/responses'

export default function Output({palettes}: {palettes: PaletteConfig[]}) {
  const [, copy] = useCopyToClipboard()
  const shaped = output(palettes)

  const displayed = JSON.stringify({colors: shaped}, null, 2).replace(/"+[0-9]+"/g, function(match) {
    return match.replace(/"/g,'');
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
          icon={ClipboardCopyIcon}
        />
      </div>
      <pre>{displayed}</pre>
    </section>
  )
}
