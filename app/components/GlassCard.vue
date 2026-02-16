<script setup>
  defineProps({
    variant: {
      type: String,
      default: "panel",
      validator: (v) => ["panel", "ui"].includes(v),
    },
    rounded: { type: String, default: "xl" },
    padding: { type: String, default: "pa-6" },
    theme: { type: String, default: null },
  })
</script>

<template>
  <v-card
    v-bind="$attrs"
    flat
    :theme="theme || (variant === 'panel' ? 'dark' : undefined)"
    :class="['glass-ui', 'border-thin', `rounded-${rounded}`, padding]"
    theme="dark"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </v-card>
</template>

<style scoped>
  .border-thin {
    border-style: solid !important;
  }
</style>
