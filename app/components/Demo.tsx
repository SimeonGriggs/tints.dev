import {MoonIcon, SparklesIcon, StarIcon, SunIcon, XMarkIcon} from '@heroicons/react/24/solid'
import {useState} from 'react'

import type {PaletteConfig} from '~/types'

import Button from './Button'

export default function Demo({close, palettes}: {close: Function; palettes: PaletteConfig[]}) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <section className="fixed inset-0 pointer-events-none w-screen h-screen z-50 flex flex-col justify-end items-center px-2 md:px-0">
      {/* Close button */}
      <div className="relative container z-10 w-full p-4 flex items-center justify-end pointer-events-auto">
        <Button id="close-demo" onClick={close}>
          <XMarkIcon className="w-4 h-auto" />
          Close Demo
        </Button>
      </div>

      {/* Background 'screen */}
      <div className="absolute inset-0 top-auto from-gray-900/100 via-gray-900/50 to-gray-900/0 bg-gradient-to-t mix-blend-multiply h-[75vh]" />

      {/* Demo container */}
      <div
        className={[
          `relative container mx-auto border-gray-800 border-[16px] border-b-0 pb-0 rounded-t-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3 md:min-h-[50vh] pointer-events-auto bg-gradient-to-b`,
          darkMode ? `dark from-first-800 to-first-900` : `from-white to-first-100`,
        ].join(` `)}
      >
        <div className="absolute z-10 p-4 md:p-12">
          <button
            className={`rounded-full p-2 bg-white dark:bg-first-900 text-first-500 hover:bg-first-500 hover:text-white transition-colors duration-200`}
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

        <div className="md:col-span-2 md:col-start-2 p-4 md:p-12 flex flex-col items-start gap-4 md:gap-8">
          <div className="bg-first-100 text-first-500 dark:bg-first-900 dark:text-first-100 text-xs leading-none font-bold inline-flex items-center gap-2 rounded-full py-1.5 px-2">
            <SparklesIcon className="w-3 h-auto" />
            Early Access
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-first-500 dark:text-first-400 leading-none">
            The tastiest demos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="flex flex-col md:col-span-1 lg:col-span-2">
              <p className="text-gray-600 dark:text-first-50 md:text-lg max-w-sm mb-4">
                This feature could do with some work. It's currently a placeholder.
              </p>
              <div className="flex items-center justify-start gap-2">
                <div className="py-3 px-4 leading-none rounded bg-first-500 text-white font-bold text-sm transition-colors duration-200 hover:cursor-pointer hover:bg-first-100 hover:text-first-600">
                  Explore
                </div>
                <div className="py-3 px-4 leading-none rounded bg-white text-first-500 font-bold text-sm transition-colors duration-200 hover:cursor-pointer hover:bg-first-100 hover:text-first-600">
                  About
                </div>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 gap-2 rounded-xl bg-first-500 text-white p-2 shadow-first-200 dark:shadow-first-900 shadow-lg">
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1 p-2">
                    <span className="text-3xl tracking-tight leading-none">99.99%</span>
                    <span className="text-xs font-bold text-first-100">Uptime</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1 p-2">
                    <span className="text-3xl tracking-tight leading-none">$159m</span>
                    <span className="text-xs font-bold text-first-100">Funding</span>
                  </div>
                  <div className="flex-1 hidden lg:flex flex-col gap-1 p-2">
                    <span className="text-3xl tracking-tight leading-none">5,000</span>
                    <span className="text-xs font-bold text-first-100">Features</span>
                  </div>
                </div>
                <div className="bg-first-700 p-2 rounded-lg">
                  <div className="flex flex-col gap-1 p-2">
                    <div className="flex items-center text-first-100 mb-2">
                      <StarIcon className="w-4 h-auto" />
                      <StarIcon className="w-4 h-auto" />
                      <StarIcon className="w-4 h-auto" />
                      <StarIcon className="w-4 h-auto" />
                      <StarIcon className="w-4 h-auto" />
                    </div>
                    <span className="text-3xl tracking-tight leading-none">Rated 5 Stars</span>
                    <span className="text-xs font-bold text-first-100">
                      By trusted research company
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
