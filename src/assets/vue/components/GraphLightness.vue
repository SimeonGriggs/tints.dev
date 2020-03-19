<template>
  <section class="md:max-w-4xl mx-auto">
    <div class="relative rounded bg-gray-800 my-4 md:my-8 flex justify-between">
      <div
        v-for="color in lightnessPalette"
        v-bind:key="color.paletteI"
        class="pointer-events-none opacity-0 transition-opacity duration-500 absolute z-10 border-2 border-white shadow rounded-full transform -translate-y-1/2 -translate-x-1/2 w-5 h-5"
        v-bind:class="[
          lightnessPalette.length > 0 ? 'opacity-100' : 'opacity-0',
          `bg-current-${color.paletteI}`
        ]"
        v-bind:style="{
          transitionDelay: `calc(${color.paletteI}ms / 3)`,
          top: `calc(50% + ${color.hScale}%)`,
          left: `${100 - color.l}%`
        }"
      ></div>
      <div
        class="absolute inset-0 border-t border-gray-600"
        style="top:50%; height: 50%;"
      ></div>
      <div class="absolute p-2 leading-none bottom-0 left-0 label">
        100 (White)
      </div>
      <div class="absolute p-2 leading-none bottom-0 right-0 label">
        0 (Black)
      </div>
      <div class="border-transparent py-10 border-l"></div>
      <div class="border-gray-700 py-10 border-l"></div>
      <div class="border-gray-700 py-10 border-l"></div>
      <div class="border-gray-700 py-10 border-l"></div>
      <div class="border-gray-700 py-10 border-l"></div>
      <div class="border-gray-600 py-10 border-l"></div>
      <div class="border-gray-700 py-10 border-l"></div>
      <div class="border-gray-700 py-10 border-l"></div>
      <div class="border-gray-700 py-10 border-l"></div>
      <div class="border-gray-700 py-10 border-l"></div>
      <div class="border-transparent py-10 border-l"></div>
    </div>
    <div class="typography px-4">
      <h2>Lightness distribution 0-100</h2>
      <p>
        Difference in <b>Hue</b> is shown on the Y axis.<b>Saturation</b>
        change is not current graphed here.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      lightnessPalette: this.palette
    };
  },
  props: {
    palette: Array
  },
  watch: {
    palette() {
      this.lightnessPalette = this.palette;
    }
  }
};
</script>
