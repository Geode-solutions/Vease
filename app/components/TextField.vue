<script setup lang="ts">
import type { Count, Label } from "@ogw_front/types/ui";
import type { ValidationRule } from "vuetify";

interface Props {
  value: string;
  rules?: ValidationRule[];
  label: Label;
  required?: boolean;
  counter?: Count;
}

interface Emits {
  input: [value: string];
}

const { value, rules = [], label, required = false, counter = undefined } = defineProps<Props>();

const emit = defineEmits<Emits>();
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
