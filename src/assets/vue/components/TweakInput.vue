<template>
  <label>
    <span class="label">
      {{ inputLabel }}
    </span>
    <input
      class="input"
      v-model="inputValue"
      @change="updateValue"
      @blur="updateValue"
      @focus="updateValue"
      @input="updateValue"
      type="number"
    />
  </label>
</template>

<script>
export default {
  data() {
    return {
      inputValue: this.value,
      inputLabel: this.label
    };
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ""
    }
  },
  methods: {
    updateValue() {
      this.$emit("inputValue", parseInt(this.inputValue));
    }
  }
};
</script>
