<script setup>
  const { value, rules, label, required, toggleVisibility } = defineProps({
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
    toggleVisibility: {
      type: Function,
      required: true,
    },
  })

  const emit = defineEmits(["input"])

  const showPassword = ref(false)
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
