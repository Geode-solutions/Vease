<script setup lang="ts">
import type { ValidationRule } from "vuetify";

const {
  value,
  rules = [],
  label,
  required = false,
  toggleVisibility,
} = defineProps<{
  value: string;
  rules?: ValidationRule[];
  label: string;
  required?: boolean;
  toggleVisibility: () => void;
}>();

const emit = defineEmits<{ input: [value: string] }>();

const showPassword = ref(false);
</script>

<template>
  <v-text-field
    :value="value"
    :rules="rules"
    :label="label"
    :required="required"
    :type="showPassword ? 'text' : 'password'"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    @input="emit('input', $event)"
    @click:append="toggleVisibility"
  ></v-text-field>
</template>
