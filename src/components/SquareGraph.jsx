import React from 'react';

const SquareGraph = ({ palettes, graph, labels }) => (
  <section className="pointer-events-none w-full">
    <div className="relative rounded bg-gray-200 flex justify-between h-48 w-full">
      {Object.keys(palettes).map((color, index) => (
        <React.Fragment key={index}>
          {Object.keys(palettes[color]).map((swatch) => {
            const scaleValue = palettes[color][swatch][`${graph}Scale`];
            const limitedScale =
              scaleValue > 0
                ? Math.min(scaleValue, 50)
                : Math.max(scaleValue, -50);

            return (
              <div
                key={palettes[color][swatch].hex}
                style={{
                  backgroundColor: palettes[color][swatch].hex,
                  transitionDelay: `${swatch / 2}ms`,
                  top: `calc(50% - ${limitedScale}%)`,
                  left: `${100 - palettes[color][swatch].l}%`,
                }}
                className="transition duration-500 absolute z-10 border-2 border-white shadow rounded-full transform -translate-y-1/2 -translate-x-1/2 w-5 h-5"
              ></div>
            );
          })}
        </React.Fragment>
      ))}
      <div
        className="absolute inset-0 border-t border-gray-400"
        style={{ top: '50%', height: '50%' }}
      ></div>
      <div className="absolute p-2 bottom-0 left-0 label">-</div>
      <div className="absolute p-2 bottom-0 left-0 right-0 text-center opacity-50 label">
        Lightness
      </div>
      <div className="absolute flex justify-center items-center h-full w-6 label">
        <span className="transform -rotate-90">{labels[graph]}</span>
      </div>
      <div className="absolute p-2 top-0 left-0 label">+</div>
      <div className="border-transparent py-10 border-l"></div>
      <div className="border-gray-300 py-10 border-l"></div>
      <div className="border-gray-300 py-10 border-l"></div>
      <div className="border-gray-300 py-10 border-l"></div>
      <div className="border-gray-300 py-10 border-l"></div>
      <div className="border-gray-400 py-10 border-l"></div>
      <div className="border-gray-300 py-10 border-l"></div>
      <div className="border-gray-300 py-10 border-l"></div>
      <div className="border-gray-300 py-10 border-l"></div>
      <div className="border-gray-300 py-10 border-l"></div>
      <div className="border-transparent py-10 border-l"></div>
    </div>
    <div className="typography pt-2 md:pt-4 text-center">
      <h2>{labels[graph]} Shift</h2>
    </div>
  </section>
);

export default SquareGraph;
