import React from 'react';

const Output = ({ palettes }) => {
  const paletteDisplay = {};

  Object.keys(palettes).map((color, index) => {
    paletteDisplay[color] = {};

    Object.keys(palettes[color]).map(swatch => {
      paletteDisplay[color][swatch] = palettes[color][swatch].hex;
    });
  });

  if (!paletteDisplay || paletteDisplay.length < 2) return null;

  return (
    <section className="p-4 mx-auto mt-4 md:mt-8 bg-gray-100 text-gray-800 text-sm border border-gray-400 rounded-lg">
      <pre>{JSON.stringify(paletteDisplay, null, '  ')}</pre>
    </section>
  );
};

export default Output;
