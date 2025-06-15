# TODO

- Run a GitHub action to typecheck and format a PR against main and commit the updates to that branch
- **Add color picker to every swatch in a palette**
  - [x] Make swatches clickable (add onClick handlers to Swatch component)
  - [x] Add visual indication of which swatch is currently selected/active (user added `selected` prop)
  - [x] Update Palette state management to handle swatch clicks (update valueStop and value)
  - [x] Integrate ColorPicker with swatch click handlers (existing ColorPicker works with clicked swatch)
  - [x] Auto-open ColorPicker when swatch is clicked (clicking swatch now both selects it AND opens color picker)
  - [x] Add proper accessibility features (ARIA labels, keyboard navigation)
  - [x] Fix palette generation instability using chroma-js for better color precision
  - [ ] Test and polish mobile/touch interaction
- Write the current state of the entire palette to a hashed URL
- Click between swatches to add a new stop in between

- **Automatic Stop Selection**

  - [x] Remove manual stop selection UI and functionality
  - [x] Implement automatic stop calculation based on color properties
    - [x] Linear mode: Map HSL lightness (0-100) to stops (0-1000)
    - [x] Perceived mode: Map luminance (0-1) to stops (0-1000)
    - [x] Round to nearest available stop (50, 100, 200, etc.)
  - [x] Update color input handling
    - [x] Apply automatic stop selection to manual color input
    - [x] Apply automatic stop selection to color picker selection
    - [x] Update swatch click behavior with automatic stop selection
  - [x] Add tests for new stop selection logic
  - [x] Update documentation to reflect new behavior

- **Manual Stop Selection Override**

  - [ ] Add toggle in UI to enable/disable automatic stop selection
  - [ ] Update state management to handle manual stop selection mode
  - [ ] Modify color input handling to respect manual mode
    - [ ] Update color picker behavior
    - [ ] Update manual color input behavior
    - [ ] Update swatch click behavior
  - [ ] Add visual indicators for manual mode
  - [ ] Add tests for manual stop selection
  - [ ] Polish mobile/touch interaction for manual mode

- **URL Structure Update**
  - [x] Create new `/palette/:hash` route
    - [x] Add route handler for new URL structure
    - [x] Implement simple JSON serialization/deserialization
    - [x] Add base64 encoding/decoding for URL safety
  - [x] Update state management
    - [x] Modify URL sync logic to use hash
    - [x] Add hash update on palette changes
  - [x] Handle legacy URLs
    - [x] Add redirect from old URL structure
    - [x] Preserve SEO value with proper 301 redirects
    - [x] Update meta tags and OpenGraph handling
  - [x] Update API endpoints
    - [x] Add new hash-based API route
    - [x] Maintain backward compatibility
  - [x] Testing
    - [x] Test serialization/deserialization
    - [x] Verify state preservation
    - [x] Test redirects
    - [x] Validate SEO impact
