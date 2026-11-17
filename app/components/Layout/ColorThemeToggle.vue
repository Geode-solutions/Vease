<script setup lang="ts">
import { useColorTheme } from "@vease/composables/color_theme";

const { isDark, toggleColorTheme } = useColorTheme();
</script>

<template>
  <v-tooltip :text="isDark ? 'Light theme' : 'Dark theme'" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        icon
        size="small"
        data-testid="colorThemeToggle"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleColorTheme()"
      >
        <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'" size="20" />
      </v-btn>
    </template>
  </v-tooltip>
</template>
