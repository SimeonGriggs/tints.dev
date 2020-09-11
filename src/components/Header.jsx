import React from 'react';

const Header = () => (
  // Things

  <header className="transition-colors duration-300 bg-current-900 mb-4 lg:m-0 px-4 py-8 lg:-mx-4 lg:px-8 lg:pt-12 lg:fixed lg:inset-0 lg:left-auto lg:w-1/3 lg:overflow-scroll">
    <div className="lg:max-w-sm mx-auto typography typography-dark">
      <h1>
        <a href="https://tailwind.simeongriggs.dev">
          Tailwind CSS Palette Generator
        </a>
      </h1>
      <p>With HSL Tweakifier</p>
    </div>
    <div className="lg:max-w-sm mx-auto typography typography-dark mt-4 pt-4 border-t border-current-800">
      <h2>What's the idea?</h2>
      <p>
        Set the initial <b>Colour</b> hex value, this is swatch 500.
      </p>
      <p>
        For colours that have <b>100% Saturation</b>, make the palette more
        interesting by shifting the <b>Hue</b> up or down.
      </p>
      <p>
        Colours with less <b>Saturation</b> get more interesting by increasing{' '}
        <b>Saturation</b> at the extremes.
      </p>
      <p>
        Shift the <b>Minimum/Maximum Lightness/Luminance</b> to spread out the
        rest of the colours to the extremes of white and black.
      </p>
      <p>
        These principals are inspired from the excellent{' '}
        <a
          href="https://refactoringui.com/book/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Refactoring UI book
        </a>{' '}
        by Adam Wathan & Steve Schoger. The same book which recommends against
        automated tools, like this :)
      </p>
      <p>I just wanted a tool to get started.</p>
    </div>
  </header>
);
export default Header;
