<template>
  <v-breadcrumbs class="ml-4" style="margin-bottom: -40px">
    <v-icon>mdi-file-tree</v-icon>
    <span class="text-h4 pa-2">/</span>

    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon variant="text">
          <v-icon>{{ selectedTree.icon }}</v-icon>
          <v-icon small>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list class="breadcrumb-menu">
        <v-list-item
          v-for="option in treeOptions"
          :key="option.value"
          @click="$emit('update:selectedTree', option)"
        >
          <v-list-item-title>
            <v-icon>{{ option.icon }}</v-icon> {{ option.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <span>{{ selectedTree.text }}</span>
  </v-breadcrumbs>
</template>

<script setup>
const props = defineProps({
  selectedTree: Object,
  treeOptions: Array,
});

const emit = defineEmits(["update:selectedTree"]);
</script>

<style scoped>
.breadcrumb-menu {
  min-width: 180px;
  background-color: transparent;
}
</style>
