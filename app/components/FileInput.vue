<script setup lang="ts">
import type { IconName, Label } from "@ogw_front/types/ui";
import type { AcceptRule } from "@ogw_front/utils/drag_and_drop";
import type { ValidationRule } from "vuetify";

interface Props {
  value: File;
  rules?: ValidationRule[];
  label: Label;
  required?: boolean;
  prependIcon?: IconName;
  accept?: AcceptRule;
}

interface Emits {
  "update:value": [value: File];
}

const {
  value,
  rules = [],
  label,
  required = false,
  prependIcon = undefined,
  accept = undefined,
} = defineProps<Props>();

const emit = defineEmits<Emits>();
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
