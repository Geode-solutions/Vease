<script setup lang="ts">
// Page header following the brand book inner pages: a small uppercase label marked with the orange dot
// Over a hairline, then the title in Urbanist, set tight.
const { title, subtitle = undefined } = defineProps<{ title: string; subtitle?: string }>();
</script>

<template>
  <header class="page-header">
    <div class="page-header__label">
      <span class="brand-dot" aria-hidden="true" />
      Vease
    </div>
    <h2 class="page-header__title">{{ title }}</h2>
    <p v-if="subtitle" class="page-header__subtitle text-medium-emphasis">{{ subtitle }}</p>
    <slot />
  </header>
</template>

<style scoped>
.page-header__label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.page-header__title {
  margin-top: 24px;
  font-family: var(--v-font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.page-header__subtitle {
  margin-top: 8px;
  max-width: 60ch;
}
</style>
