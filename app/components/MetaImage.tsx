import Swatch from '~/components/Swatch'
import {META} from '~/lib/constants'
import type {PaletteConfig} from '~/types/palette'

export default function MetaImage({
  palettes,
  canonical,
}: {
  palettes: PaletteConfig[]
  canonical: string
}) {
  const darkColor = palettes[0].swatches.find((swatch) => swatch.stop === 800)?.hex
  const lightColor = palettes[0].swatches.find((swatch) => swatch.stop === 300)?.hex
  const url = (canonical ? canonical : META.origin).replace(`https://`, ``)

  return (
    <article
      id="meta-image"
      className="absolute inset-0 z-50 mx-auto flex flex-col justify-between overflow-hidden"
      style={{
        width: 1200,
        height: 630,
      }}
    >
      {palettes.map((palette: PaletteConfig) => (
        <div key={palette.value} className="w-full p-12 grid grid-cols-1 gap-6">
          <div className="flex gap-6 justify-start items-end">
            <span className="text-7xl font-mono" style={{color: darkColor}}>
              {palette.name}
            </span>{' '}
            <span
              className="text-5xl font-bold transform -translate-y-1"
              style={{color: lightColor}}
            >
              #{palette.value.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-6 w-full text-2xl">
            {palette.swatches
              .filter((swatch) => ![0, 1000].includes(swatch.stop))
              .map((swatch) => (
                <Swatch key={swatch.stop} swatch={swatch} />
              ))}
          </div>
        </div>
      ))}

      <div
        style={{
          backgroundColor: darkColor,
          clipPath: `polygon(0 20%, 100% 0, 100% 100%, 0% 100%)`,
        }}
        className="pt-20 p-12 text-white flex flex-col gap-3"
      >
        <span className="text-5xl whitespace-nowrap">{url}</span>
        <span style={{color: lightColor}} className="text-2xl font-bold whitespace-nowrap">
          {META.title}
        </span>
      </div>
    </article>
  )
}
