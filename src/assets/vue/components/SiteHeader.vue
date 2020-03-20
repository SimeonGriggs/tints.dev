<template>
  <section
    class="transition-colors duration-300 bg-current-900 -mx-4 mb-4 md:m-0 px-4 py-8 md:px-8 md:pt-12 md:fixed md:inset-0 md:left-auto md:w-1/3 md:overflow-scroll"
  >
    <div class="md:max-w-sm mx-auto typography typography-dark">
      <h1>
        <a href="https://tailwind.simeongriggs.dev">Tailwind CSS Palette Generator</a>
      </h1>
      <p>With HSL Tweakifier</p>
    </div>
    <div
      class="md:max-w-sm mx-auto typography typography-dark mt-4 pt-4 border-t border-current-800"
    >
      <h2>What's the idea?</h2>
      <p>
        Set the initial
        <b>Colour</b> hex value, this is swatch 500.
      </p>
      <p>
        For colours that have
        <b>100% Saturation</b>, make the palette
        more interesting by shifting the
        <b>Hue</b> up or down.
      </p>
      <p>
        Colours with less
        <b>Saturation</b> get more interesting by increasing
        <b>Saturation</b> at the extremes.
      </p>
      <p>
        Shift the
        <b>Minimum/Maximum Lightness</b> to spread out the rest of the
        colours to the extremes of white and black.
      </p>
      <p>
        These principals are inspired from the excellent
        <a
          href="https://refactoringui.com/book/"
          target="_blank"
          rel="noopener"
        >Refactoring UI book</a> by
        Adam Wathan & Steve Schoger. The same book which recommends against
        automated tools, like this :)
      </p>
      <p>I just wanted a tool to get started.</p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      thing: true
    };
  }
};
</script>
