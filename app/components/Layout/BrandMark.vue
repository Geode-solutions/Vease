<script setup lang="ts">
import type { Pixels } from "@ogw_front/types/ui";
import markUrl from "@vease/assets/img/brand/geode_mark.svg";

interface Props {
  size: Pixels;
}

const { size } = defineProps<Props>();

// The mark is drawn with currentColor (CSS mask), so it follows the theme like text does.
const style = computed(() => ({
  width: `${size}px`,
  height: `${size}px`,
  maskImage: `url(${markUrl})`,
  WebkitMaskImage: `url(${markUrl})`,
}));
</script>

<template>
  <span class="brand-mark" :style="style" aria-hidden="true" />
</template>

<style scoped>
.brand-mark {
  display: inline-block;
  flex: none;
  /* Official logo colors only (brand book): set per theme in main.css */
  background-color: var(--vease-logo-color, currentColor);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>
