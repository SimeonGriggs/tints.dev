import {useState} from 'react'
import {MoonIcon, SparklesIcon, SunIcon, XIcon} from '@heroicons/react/solid'
import Button from './Button'
import {PaletteConfig} from '~/types/palette'

export default function Demo({close, palettes}: {close: Function; palettes: PaletteConfig[]}) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <section className="fixed inset-0 pointer-events-none w-screen h-screen z-50 flex flex-col justify-end items-center px-2 md:px-0">
      {/* Close button */}
      <div className="relative container z-10 w-full p-4 flex items-center justify-end pointer-events-auto">
        <Button id="close-demo" onClick={close}>
          <XIcon className="w-4 h-auto" />
          Close Demo
        </Button>
      </div>

      {/* Background 'screen */}
      <div className="absolute inset-0 top-auto from-gray-900/100 via-gray-900/50 to-gray-900/0 bg-gradient-to-t mix-blend-multiply h-[75vh]" />

      {/* Demo container */}
      <div
        className={[
          `relative container mx-auto border-gray-800 border-[16px] border-b-0 pb-0 rounded-t-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3 md:min-h-[50vh] pointer-events-auto`,
          darkMode ? `dark bg-first-900` : `bg-white`,
        ].join(` `)}
      >
        <div className="absolute z-10 p-4 md:p-12">
          <button
            className="bg-white rounded-full p-2 text-first-500 hover:bg-first-500 hover:text-white transition-colors duration-200"
            type="button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <SunIcon className="w-5 h-auto" /> : <MoonIcon className="w-5 h-auto" />}
          </button>
        </div>
        <img
          loading="lazy"
          style={{clipPath: `polygon(0 0, 100% 0%, 75% 100%, 0% 100%)`}}
          className="bg-first-100 md:absolute top-0 md:bottom-0 w-11/12 md:w-1/3 h-24 md:h-full object-cover"
          src={`//picsum.photos/seed/${palettes[0].value}/400/800/`}
          width="400"
          height="800"
          alt=""
        />

        <div className="md:col-span-2 md:col-start-2 p-4 md:p-12 flex flex-col items-start gap-2">
          <div className="bg-first-50 text-first-500 dark:bg-first-800 dark:text-first-100 text-xs leading-none font-bold inline-flex items-center gap-2 rounded-full py-1.5 px-2">
            <SparklesIcon className="w-3 h-auto" />
            Early Access
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-first-500 dark:text-first-400 leading-none">
            The tastiest demos
          </h2>

          <p className="text-gray-600 dark:text-first-50 md:text-lg max-w-sm py-2 md:py-6">
            This feature could do with some work. It's currently a placeholder. Future versions
            would let you see multi-color Palettes in different designs.
          </p>

          <div className="flex items-center justify-start gap-2">
            <div className="py-3 px-4 leading-none rounded-lg bg-first-500 border border-first-500 text-white font-bold text-sm transition-colors duration-200 hover:cursor-pointer hover:bg-first-100 hover:border-first-200 hover:text-first-600">
              Explore
            </div>
            <div className="py-3 px-4 leading-none rounded-lg bg-white border border-first-300 text-first-500 font-bold text-sm transition-colors duration-200 hover:cursor-pointer hover:bg-first-100 hover:border-first-200 hover:text-first-600">
              About
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
