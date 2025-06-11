# TODO

- Run a GitHub action to typecheck and format a PR against main and commit the updates to that branch
- **Add color picker to every swatch in a palette**
  - [x] Make swatches clickable (add onClick handlers to Swatch component)
  - [x] Add visual indication of which swatch is currently selected/active (user added `selected` prop)
  - [x] Update Palette state management to handle swatch clicks (update valueStop and value)
  - [x] Integrate ColorPicker with swatch click handlers (existing ColorPicker works with clicked swatch)
  - [x] Add proper accessibility features (ARIA labels, keyboard navigation)
  - [x] Fix palette generation instability using chroma-js for better color precision
  - [ ] Test and polish mobile/touch interaction
- Write the current state of the palette to a KV storage so it's shareable
- Click between swatches to add a new one in between
