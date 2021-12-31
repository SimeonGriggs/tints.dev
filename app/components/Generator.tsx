import React, {useState, useEffect} from 'react'

import Header from './Header'
import type {PaletteConfig} from '~/types/palette'
import Palette from '~/components/Palette'
import Graphs from '~/components/Graphs'
import Output from '~/components/Output'
import {createRandomPalette} from '~/lib/helpers'
import {convertParamsToPath, removeSearchParamByKey} from '~/lib/history'
import {Block, PortableText} from '~/components/PortableText'
import {handleMeta} from '~/lib/meta'

export default function Generator({palettes, about}: {palettes: PaletteConfig[]; about: Block[]}) {
  const [palettesState, setPalettesState] = useState(palettes)

  // Update document title on change
  useEffect(() => {
    handleMeta(palettesState)
  }, [palettesState])

  const handleNew = () => {
    const currentValues = palettesState.map((p) => p.value)
    const randomPalette = createRandomPalette(currentValues)
    const newPalettes = [...palettesState, randomPalette]
    setPalettesState(newPalettes)

    // Scroll new ID into view
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const newElement = document.getElementById(`s-${randomPalette.value.toUpperCase()}`)

        if (newElement) {
          newElement.scrollIntoView({behavior: 'smooth'})
        }
      }, 50)
    }
  }

  const handleUpdate = (palette: PaletteConfig, index: number) => {
    const currentPalettes = [...palettesState]
    currentPalettes[index] = palette

    setPalettesState(currentPalettes)
  }

  const handleDelete = (deleteId: string, deleteName: string) => {
    if (palettesState.length === 1) {
      return
    }

    const updatedPalettes = palettesState.filter((p, i) => p.id !== deleteId)

    if (updatedPalettes.length === 1) {
      // Switch from query params to path
      convertParamsToPath(updatedPalettes)
    } else {
      // Update query params
      removeSearchParamByKey(deleteName)
    }

    setPalettesState(updatedPalettes)
  }

  const styleString = [
    `:root { --color-primary: 255 115 179; }`,
    `:root {`,
    `--second: ${palettesState[0].swatches[6].hex};`,
    ...palettesState[0].swatches.map((swatch) => `--first-${swatch.stop}: ${swatch.hex};`),
    `}`,
  ].join(`\n`)

  return (
    <main className="pb-32 pt-header">
      <style>{styleString}</style>

      <Header handleNew={handleNew} />

      <section className="grid grid-cols-1 p-4 gap-y-12 container mx-auto">
        {palettesState.map((palette: PaletteConfig, index: number) => (
          <React.Fragment key={palette.id}>
            <Palette
              palette={palette}
              updateGlobal={(updatedPalette: PaletteConfig) => handleUpdate(updatedPalette, index)}
              deleteGlobal={
                palettesState.length <= 1 ? undefined : () => handleDelete(palette.id, palette.name)
              }
            />
            <div className="border-t border-gray-200" />
          </React.Fragment>
        ))}

        <Graphs palettes={palettesState} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="row-start-2 md:row-start-1 md:col-span-3">
            {about.length ? <PortableText blocks={about} /> : null}
          </div>
          <div className="row-start-1 md:col-span-2 flex flex-col gap-4">
            <div className="prose text-center">
              <p>
                Paste this into your <code>tailwind.config.js</code>
              </p>
            </div>
            <Output palettes={palettesState} />
          </div>
        </div>
      </section>
    </main>
  )
}
