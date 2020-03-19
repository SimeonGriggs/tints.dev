<template>
  <section
    v-if="output.length > 2"
    class="md:max-w-4xl typography p-4 mx-auto mt-4 md:mt-8 bg-current-100 text-current-800 text-sm border-2 border-current-400 rounded-lg"
  >
    <pre>awesomeColor: {{ output }}</pre>
  </section>
</template>

<script>
export default {
  data() {
    return {
      output: this.displayPalette(this.palette)
    };
  },
  methods: {
    displayPalette() {
      let paletteOutput = {};

      if (!this.palette) {
        return false;
      }

      this.palette.forEach(swatch => {
        paletteOutput[swatch.paletteI] = swatch.hex;
      });

      return JSON.stringify(paletteOutput, null, "  ");
    }
  },
  props: {
    palette: Array
  },
  watch: {
    palette() {
      this.output = this.displayPalette();
    }
  }
};
</script>
