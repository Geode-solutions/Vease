<template>
  <ViewerContextualMenuItem v-bind="$attrs">
    <template #btn="{ btnStyle }">
      <Surface
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>
  </ViewerContextualMenuItem>
</template>

<script setup>
import Surface from "@/assets/viewer_svgs/surface.svg";




</script>

