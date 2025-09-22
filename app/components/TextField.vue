<template>
  <v-text-field
    :value="value"
    :rules="rules"
    :label="label"
    :required="required"
    :counter="counter"
    @input="$emit('input', $event)"
  ></v-text-field>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        required: true,
      },
      rules: {
        type: Array,
        default: () => [],
      },
      label: {
        type: String,
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
      counter: {
        type: Number,
        default: null,
      },
    },
  }
</script>
