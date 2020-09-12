import React from 'react';

const Output = ({ colors, palettes }) => {
  const paletteDisplay = {};

  if (Object.keys(colors).length) {
    Object.keys(colors).map((color, index) => {
      paletteDisplay[color] = {};

      Object.keys(colors[color].palettes).map((swatch) => {
        paletteDisplay[color][swatch] = colors[color].palettes[swatch].hex;
      });
    });
  } else {
    Object.keys(palettes).map((color, index) => {
      paletteDisplay[color] = {};

      Object.keys(palettes[color]).map((swatch) => {
        paletteDisplay[color][swatch] = palettes[color][swatch].hex;
      });
    });
  }

  if (!paletteDisplay || Object.keys(paletteDisplay).length < 1) return null;

  return (
    <section className="p-4 mx-auto mt-4 md:mt-8 bg-gray-100 text-gray-800 text-sm border border-gray-400 rounded-lg">
      <pre>{JSON.stringify(paletteDisplay, null, '  ')}</pre>
    </section>
  );
};

export default Output;
