<script setup lang="ts">
import type { ValidationRule } from "vuetify";

const {
  value,
  rules = [],
  label,
  required = false,
  prependIcon = undefined,
  accept = undefined,
} = defineProps<{
  value: File;
  rules?: ValidationRule[];
  label: string;
  required?: boolean;
  prependIcon?: string;
  accept?: string;
}>();

const emit = defineEmits<{ "update:value": [value: File] }>();
</script>

<template>
  <v-file-input
    :model-value="value"
    @update:model-value="emit('update:value', $event as File)"
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
