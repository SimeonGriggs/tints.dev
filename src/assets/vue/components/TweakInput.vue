<template>
  <label>
    <span class="label">{{ inputObject.label }}</span>
    <input
      class="input"
      v-model="inputValue"
      :min="inputObject.min"
      :max="inputObject.max"
      @input="sendTweak"
      @change="sendTweak"
      @blur="sendTweak"
      @focus="sendTweak"
      type="number"
    />
  </label>
</template>

<script>
import { EventBus } from "../../js/event-bus";

export default {
  data() {
    return {
      inputValue: this.value,
      inputObject: this.input
    };
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    input: {
      type: Object,
      default: {}
    }
  },
  methods: {
    sendTweak() {
      const tweak = {};
      tweak[this.inputObject.tweak] = parseInt(this.inputValue);

      EventBus.$emit("sendTweak", tweak);
    }
  }
};
</script>
