import React from 'react';

const Swatch = ({ swatch, color }) => {
  const { hex, h, s, l } = color;

  return (
    <div className="flex flex-col justify-center items-start flex-1 w-full">
      <div
        style={{ backgroundColor: hex, transitionDelay: `${swatch / 2}ms` }}
        className="transition-colors duration-200 shadow-inner rounded p-2 pt-12 w-full leading-none"
      >
        <span className="opacity-50 font-mono text-xs">{swatch}</span>
      </div>
      <span className="transition-colors duration-300 flex flex-col p-2 pb-0">
        <span className="font-mono text-xs pb-1 mb-1 border-b border-current-200">
          {hex}
        </span>
        <span className="font-mono text-xs">H {h}</span>
        <span className="font-mono text-xs">S {s}%</span>
        <span className="font-mono text-xs">L {l}%</span>
      </span>
    </div>
  );
};

export default Swatch;
