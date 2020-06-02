import React from 'react';
import Swatch from './Swatch';

const Palettes = ({ palettes }) => (
  <section className="flex space-x-4">
    {Object.keys(palettes).map((color, index) => (
      <React.Fragment key={index}>
        {Object.keys(palettes[color]).map(swatch => (
          <Swatch
            key={swatch}
            swatch={swatch}
            color={palettes[color][swatch]}
          />
        ))}
      </React.Fragment>
    ))}
  </section>
);

export default Palettes;
