# Palette Generator and API for Tailwind CSS

Read the [launch blog post for full details](https://www.simeongriggs.dev/using-the-tailwind-css-palette-generator-and-api) on how this works!

## Palette Creator

Set the initial **Value** as a valid hexadecimal colour. By default this is stop 500, but it can be changed to any stop from 50-950.

For colours that have 100% **Saturation**, make the Palette more interesting by shifting the **Hue** up or down.

Palettes starting from a Base colour with little **Saturation** get more interesting by increasing **Saturation** at the extremes.

Shift the **Minimum/Maximum** **Lightness/Luminance** to spread out the rest of the colours to the extremes of white and black. Switch between Lightness and Luminance to produce a different spread of colours at the extremes.

These principles are inspired by the excellent [Refactoring UI](https://refactoringui.com/book/) book by Adam Wathan & Steve Schoger. The same book recommends against automated tools, just like this one!

This tool exists to fast-track the creation of new palettes.

## Palette API

Any set of Palettes can be fetched via an API. You may find this useful for design tools that need to generate a 50-950 Palette from just a single Hex value.

Currently, the API will only return a Palette using the base hex value, with no options to have HSL tweaks.

## Credits

Made by [Simeon Griggs](https://simeongriggs.dev/)

* Designed with [Tailwind CSS](https://tailwindcss.com/) (obvs) 
  * with a sprinkling of [Headless UI](https://headlessui.dev/)
  * and a dash of [HeroIcons](https://heroicons.com/)
* Built with [React Router](https://reactrouter.com)
* Hosted on [Vercel](https://vercel.com)
* Content in [Sanity.io](https://www.sanity.io/)