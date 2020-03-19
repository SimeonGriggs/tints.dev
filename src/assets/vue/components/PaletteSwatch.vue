<template>
  <div class="flex flex-col justify-center items-start flex-1 w-full">
    <div
      class="transition-colors duration-300 shadow-inner rounded p-2 pt-12 w-full leading-none"
      v-bind:style="[indexStyle]"
      v-bind:class="[
        indexClass,
        swatchObject.paletteI > 500 ? 'text-white' : ''
      ]"
    >
      <span class="opacity-50 font-mono text-xs">{{
        swatchObject.paletteI
      }}</span>
    </div>
    <span class="transition-colors duration-300 flex flex-col p-2 pb-0">
      <span class="font-mono text-xs pb-1 mb-1 border-b border-current-200">{{
        swatchObject.hex
      }}</span>
      <span class="font-mono text-xs">H {{ swatchObject.h }}</span>
      <span class="font-mono text-xs">S {{ swatchObject.s }}%</span>
      <span class="font-mono text-xs">L {{ swatchObject.l }}%</span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      swatchObject: this.swatch,
      swatchIndex: this.swatch.paletteI,
      indexClass: `bg-current-${this.swatch.paletteI}`,
      indexStyle: {
        transitionDelay: this.swatch.paletteI + "ms"
      }
    };
  },
  props: {
    swatch: {
      type: Object,
      default: {}
    }
  }
};
</script>
