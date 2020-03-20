<template>
  <section class="pointer-events-none">
    <div class="relative rounded bg-gray-200 flex justify-between h-48 w-full">
      <div
        v-for="color in lightnessPalette"
        v-bind:key="color.paletteI"
        class="opacity-0 transition-opacity duration-500 absolute z-10 border-2 border-white shadow rounded-full transform -translate-y-1/2 -translate-x-1/2 w-5 h-5"
        v-bind:class="[
          lightnessPalette.length > 0 ? 'opacity-100' : 'opacity-0',
          `bg-current-${color.paletteI}`
        ]"
        v-bind:style="{
          transitionDelay: `${color.paletteI}ms`,
          top: `calc(50% - ${color[`${graphTweak}Scale`]}%)`,
          left: `${100 - color.l}%`
        }"
      ></div>
      <div class="absolute inset-0 border-t border-gray-400" style="top:50%; height: 50%;"></div>
      <div class="absolute p-2 bottom-0 left-0 label">-</div>
      <div class="absolute p-2 bottom-0 left-0 right-0 text-center opacity-50 label">Lightness</div>
      <div class="absolute flex justify-center items-center h-full w-6 label">
        <span class="transform -rotate-90">{{ graphInputs.label }}</span>
      </div>
      <div class="absolute p-2 top-0 left-0 label">+</div>
      <div class="border-transparent py-10 border-l"></div>
      <div class="border-gray-300 py-10 border-l"></div>
      <div class="border-gray-300 py-10 border-l"></div>
      <div class="border-gray-300 py-10 border-l"></div>
      <div class="border-gray-300 py-10 border-l"></div>
      <div class="border-gray-400 py-10 border-l"></div>
      <div class="border-gray-300 py-10 border-l"></div>
      <div class="border-gray-300 py-10 border-l"></div>
      <div class="border-gray-300 py-10 border-l"></div>
      <div class="border-gray-300 py-10 border-l"></div>
      <div class="border-transparent py-10 border-l"></div>
    </div>
    <div class="typography pt-2 md:pt-4 text-center">
      <h2>{{ graphInputs.label }} Shift</h2>
    </div>
  </section>
</template>

<script>
import { EventBus } from "../../js/event-bus";

export default {
  data() {
    return {
      lightnessPalette: [],
      graphTweak: this.graph,
      graphInputs: this.inputs.find(input => input.tweak === this.graph)
    };
  },
  props: {
    graph: {
      type: String,
      default: ""
    },
    inputs: {
      type: Array,
      default: []
    }
  },
  mounted() {
    EventBus.$on("newPalette", newPalette => {
      this.lightnessPalette = newPalette;
    });
  }
};
</script>
