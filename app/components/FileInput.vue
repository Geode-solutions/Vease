<script setup>
  const { value, rules, label, required, prependIcon, accept } = defineProps({
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
      default: undefined,
    },
    accept: {
      type: String,
      default: undefined,
    },
  })
</script>

<template>
  <v-file-input
    :model-value="value"
    @update:model-value="$emit('update:value', $event)"
    :rules="rules"
    :label="label"
    :required="required"
    :prepend-icon="prependIcon"
    :accept="accept"
    variant="outlined"
    density="compact"
    hide-details="auto"
  />
</template>
