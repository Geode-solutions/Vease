<script>
  export default {
    props: {
      value: {
        type: File,
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
      prependIcon: {
        type: String,
        default: null,
      },
      accept: {
        type: String,
        default: null,
      },
    },
  }
</script>

<template>
  <v-file-input
    :value="value"
    :rules="rules"
    :label="label"
    :required="required"
    :prepend-icon="prependIcon"
    :accept="accept"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
  ></v-file-input>
</template>
