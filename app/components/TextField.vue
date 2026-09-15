<script setup lang="ts">
import type { ValidationRule } from "vuetify";

const {
  value,
  rules = [],
  label,
  required = false,
  counter = undefined,
} = defineProps<{
  value: string;
  rules?: ValidationRule[];
  label: string;
  required?: boolean;
  counter?: number;
}>();

const emit = defineEmits<{ input: [value: string] }>();
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
