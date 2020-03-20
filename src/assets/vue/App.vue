<template>
  <main class="md:w-2/3 px-4 md:px-8 md:py-12">
    <site-header></site-header>
    <!-- Inputs -->
    <form
      class="md:max-w-4xl mx-auto mb-4 md:mb-8 p-2 py-4 sm:p-4 grid grid-flow-col gap-2 grid-cols-5 bg-gray-200 rounded-lg"
    >
      <label>
        <span class="label">Colour</span>
        <input
          class="input"
          v-bind:class="[
            inputHexIsValid ? '' : 'border-red-500 focus:border-red-600'
          ]"
          v-model="inputHex"
          @change="updatePalette"
          @click="updatePalette"
          @blur="updatePalette"
          @focus="updatePalette"
          @input="updatePalette"
        />
      </label>

      <tweak-input @inputValue="tweak.h = $event" :value="tweak.h" label="Hue"></tweak-input>
      <tweak-input @inputValue="tweak.s = $event" :value="tweak.s" label="Saturation"></tweak-input>
      <tweak-input @inputValue="tweak.lMax = $event" :value="tweak.lMax" label="Lightness Max"></tweak-input>
      <tweak-input @inputValue="tweak.lMin = $event" :value="tweak.lMin" label="Lightness Min"></tweak-input>
    </form>

    <!-- Swatches -->
    <div class="grid grid-cols-9 gap-2 md:max-w-4xl mx-auto px-4">
      <palette-swatch
        v-for="(swatch, index) in palette"
        v-bind:key="index + '-' + swatch.hex"
        v-bind:swatch="swatch"
      />
    </div>

    <!-- Graphs -->
    <graph-lightness v-if="palette.length > 0" v-bind:palette="palette"></graph-lightness>

    <!-- Output -->
    <output-palette v-bind:palette="palette"></output-palette>

    <!-- Footer -->
    <site-footer></site-footer>
  </main>
</template>

<script>
import Vue from "vue";

import SiteHeader from "./components/SiteHeader.vue";
import PaletteSwatch from "./components/PaletteSwatch.vue";
import TweakInput from "./components/TweakInput.vue";
import GraphLightness from "./components/GraphLightness.vue";
import OutputPalette from "./components/OutputPalette.vue";
import SiteFooter from "./components/SiteFooter.vue";

import { hexToHSL, HSLToHex, isHex, round } from "../js/helpers";
import {
  createSaturationScale,
  createHueScale,
  createLightnessValues
} from "../js/scales";

export default Vue.extend({
  name: "PaletteGenerator",
  data() {
    return {
      inputHex: `#4095BF`,
      inputHexIsValid: true,
      palette: [],
      tweak: {
        h: 2,
        s: 20,
        lMax: 96,
        lMin: 15
      }
    };
  },
  components: {
    SiteHeader,
    PaletteSwatch,
    TweakInput,
    GraphLightness,
    OutputPalette,
    SiteFooter
  },
  watch: {
    tweak: {
      handler() {
        // Todo, why doesn't the 'PaletteSwatch watch' method run when 'tweak' changes?!
        this.updatePalette();
      },
      deep: true
    }
  },
  methods: {
    updatePalette() {
      let { inputHexIsValid, inputHex, tweak } = this;

      inputHexIsValid = inputHex.length === 7 && isHex(inputHex);

      if (inputHexIsValid) {
        const inputHsl = hexToHSL(inputHex);
        const { h, s, l } = inputHsl;

        const hueScale = createHueScale(tweak.h);
        const saturationScale = createSaturationScale(tweak.s);
        const lightnessScale = createLightnessValues(tweak.lMin, tweak.lMax, l);

        const newPalette = [];

        hueScale.forEach((swatch, i) => {
          // Hue value must be between 0-360
          // todo: fix this inside the function
          let newH = h + hueScale[i];
          newH = newH < 0 ? 360 + newH - 1 : newH;
          newH = newH > 720 ? newH - 360 : newH;
          newH = newH > 360 ? newH - 360 : newH;

          // Saturation must be between 0-100
          // todo: fix this inside the function
          let newS = s + saturationScale[i];
          newS = newS > 100 ? 100 : newS;

          const newL = lightnessScale[i];

          const newHex = HSLToHex(newH, newS, newL);
          const paletteI = (i + 1) * 100;

          const swatchObject = {
            paletteI,
            hex: newHex,
            h: newH,
            hScale: hueScale[i],
            s: round(newS, 2),
            l: round(newL, 2)
          };

          // Update CSS vars
          document.documentElement.style.setProperty(
            `--current-${paletteI}`,
            newHex
          );

          // Push to array
          newPalette.push(swatchObject);
        });

        this.palette = newPalette;
      }
    }
  }
});
</script>

<style>
/* .container {
  color: green;
} */
</style>
