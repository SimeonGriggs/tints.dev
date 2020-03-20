<template>
  <section class="pointer-events-none md:max-w-4xl mx-auto">
    <div class="relative rounded bg-gray-800 mt-4 md:mt-8 flex justify-between">
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
          top: `50%`,
          left: `${100 - color.l}%`
        }"
      ></div>
      <div class="absolute inset-0 border-t border-gray-600" style="top:50%; height: 50%;"></div>
      <div class="absolute p-2 leading-none bottom-0 left-0 label">100 (White)</div>
      <div class="absolute p-2 leading-none bottom-0 right-0 label">0 (Black)</div>
      <div class="border-transparent py-6 border-l"></div>
      <div class="border-gray-700 py-6 border-l"></div>
      <div class="border-gray-700 py-6 border-l"></div>
      <div class="border-gray-700 py-6 border-l"></div>
      <div class="border-gray-700 py-6 border-l"></div>
      <div class="border-gray-600 py-6 border-l"></div>
      <div class="border-gray-700 py-6 border-l"></div>
      <div class="border-gray-700 py-6 border-l"></div>
      <div class="border-gray-700 py-6 border-l"></div>
      <div class="border-gray-700 py-6 border-l"></div>
      <div class="border-transparent py-6 border-l"></div>
    </div>
    <div class="typography text-center pt-2 md:pt-4">
      <h2>Lightness Distribution 0-100</h2>
    </div>
  </section>
</template>

<script>
import { EventBus } from "../../js/event-bus";

export default {
  data() {
    return {
      lightnessPalette: []
    };
  },
  mounted() {
    EventBus.$on("newPalette", newPalette => {
      this.lightnessPalette = newPalette;
    });
  }
};
</script>
