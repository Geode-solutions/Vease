<script setup>
import { useAppStore } from "@ogw_front/stores/app";

const appStore = useAppStore();

const allGlobalComponents = computed(() => {
  const components = [];
  for (const extensionComponents of appStore.globalComponents.values()) {
    for (const component of extensionComponents.values()) {
      components.push(component);
    }
  }
  return components;
});
</script>

<template>
  <component v-for="(comp, index) in allGlobalComponents" :is="comp" :key="`global-ext-${index}`" />
</template>
