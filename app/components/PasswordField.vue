<script setup lang="ts">
import type { Label } from "@ogw_front/types/ui";
import type { Password } from "@vease/types/auth";
import type { ValidationRule } from "vuetify";

interface Props {
  value: Password;
  rules?: ValidationRule[];
  label: Label;
  required?: boolean;
  toggleVisibility: () => void;
}

interface Emits {
  input: [value: Password];
}

const { value, rules = [], label, required = false, toggleVisibility } = defineProps<Props>();

const emit = defineEmits<Emits>();

const showPassword = ref(false);
</script>

<template>
  <v-text-field
    :value="value"
    :rules="rules"
    :label="label"
    :required="required"
    :type="showPassword ? 'text' : 'password'"
    :append-icon="showPassword ? 'ph-fill ph-eye' : 'ph-eye-slash'"
    @input="emit('input', $event)"
    @click:append="toggleVisibility"
  ></v-text-field>
</template>
