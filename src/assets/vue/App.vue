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

      <tweak-input
        v-for="(input, index) in tweakInputs"
        :key="index"
        :value="tweak[input.tweak]"
        :input="input"
      />
    </form>

    <!-- Swatches -->
    <div class="grid grid-cols-9 gap-2 md:max-w-4xl mx-auto md:px-4">
      <palette-swatch
        v-for="(swatch, index) in palette"
        v-bind:key="index + '-' + swatch.hex"
        v-bind:swatch="swatch"
      />
    </div>

    <!-- Graphs -->
    <graph-lightness v-if="palette.length > 0"></graph-lightness>

    <section
      v-if="palette.length > 0"
      class="grid gap-4 md:gap-8 md:grid-cols-2 md:max-w-4xl mx-auto my-4 md:my-8"
    >
      <graph-square graph="h" :inputs="tweakInputs"></graph-square>
      <graph-square graph="s" :inputs="tweakInputs"></graph-square>
    </section>

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
import GraphSquare from "./components/GraphSquare.vue";
import OutputPalette from "./components/OutputPalette.vue";
import SiteFooter from "./components/SiteFooter.vue";

import { EventBus } from "../js/event-bus";
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
      },
      tweakInputs: [
        {
          tweak: "h",
          label: "Hue",
          min: -20,
          max: 20
        },
        {
          tweak: "s",
          label: "Saturation",
          min: -20,
          max: 20
        },
        {
          tweak: "lMax",
          label: "Lightness Max",
          min: 50,
          max: 100
        },
        {
          tweak: "lMin",
          label: "Lightness Min",
          min: 0,
          max: 50
        }
      ]
    };
  },
  components: {
    SiteHeader,
    PaletteSwatch,
    TweakInput,
    GraphLightness,
    GraphSquare,
    OutputPalette,
    SiteFooter
  },
  mounted() {
    // Spread in newly tweaked value and update
    EventBus.$on("sendTweak", incomingTweak => {
      this.tweak = {
        ...this.tweak,
        ...incomingTweak
      };

      this.updatePalette();
    });
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
            sScale: saturationScale[i],
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

        // Push array to state
        this.palette = newPalette;

        // ...and an event for anyone listening
        EventBus.$emit("newPalette", newPalette);
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
