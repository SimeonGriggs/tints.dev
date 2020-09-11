import React from 'react';

const LuminanceGraph = ({ palettes }) => (
  // Things

  <section className="pointer-events-none w-full">
    <div className="relative rounded bg-gray-800 mt-4 md:mt-8 flex justify-between">
      {Object.keys(palettes).map((color, index) => (
        <React.Fragment key={index}>
          {Object.keys(palettes[color]).map((swatch) => (
            <div
              key={palettes[color][swatch].hex}
              style={{
                backgroundColor: palettes[color][swatch].hex,
                transitionDelay: `${swatch / 2}ms`,
                top: '50%',
                left: `${100 - palettes[color][swatch].lum}%`,
              }}
              className="transition duration-500 absolute z-10 border-2 border-white shadow rounded-full transform -translate-y-1/2 -translate-x-1/2 w-5 h-5"
            ></div>
          ))}
        </React.Fragment>
      ))}
      <div
        className="absolute inset-0 border-t border-gray-600"
        style={{ top: '50%', height: '50%' }}
      ></div>
      <div className="absolute p-2 leading-none bottom-0 left-0 label">
        100 (White)
      </div>
      <div className="absolute p-2 leading-none bottom-0 right-0 label">
        0 (Black)
      </div>
      <div className="border-transparent py-6 border-l"></div>
      <div className="border-gray-700 py-6 border-l"></div>
      <div className="border-gray-700 py-6 border-l"></div>
      <div className="border-gray-700 py-6 border-l"></div>
      <div className="border-gray-700 py-6 border-l"></div>
      <div className="border-gray-600 py-6 border-l"></div>
      <div className="border-gray-700 py-6 border-l"></div>
      <div className="border-gray-700 py-6 border-l"></div>
      <div className="border-gray-700 py-6 border-l"></div>
      <div className="border-gray-700 py-6 border-l"></div>
      <div className="border-transparent py-6 border-l"></div>
    </div>
    <div className="typography text-center pt-2 md:pt-4">
      <h2>Luminance Distribution 0-100</h2>
    </div>
  </section>
);
export default LuminanceGraph;
