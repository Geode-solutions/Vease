<script setup>
  const { value, rules, label, required, counter } = defineProps({
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
      default: undefined,
    },
  })

  const emit = defineEmits(["input"])
</script>

<template>
  <v-text-field
    :value="value"
    :rules="rules"
    :label="label"
    :required="required"
    :counter="counter"
    @input="emit('input', $event)"
  ></v-text-field>
</template>
