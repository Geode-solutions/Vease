<template>
  <ViewerGenericMeshPointsSize />
</template>

<script setup>
const dataStyleStore = useDataStyleStore();
dataStyleStore.setMeshPointsColor();
</script>
