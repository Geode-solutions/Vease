<template>
  <v-treeview
    v-model:selected="dataBaseStore.db[props.id].mesh_components_selection"
    :items="items"
    return-object
    class="transparent-treeview"
    item-value="id"
    select-strategy="classic"
    selectable
  >
    <template #title="{ item }">
      <span class="treeview-item">{{ item.title }}</span>
    </template>
  </v-treeview>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { use_treeview_store } from "@/stores/treeview";
import { useDataStyleStore } from "@/stores/data_style";
import { useDataBaseStore } from "@/stores/data_base";

const treeviewStore = use_treeview_store();
const dataStyleStore = useDataStyleStore();
const dataBaseStore = useDataBaseStore();

const props = defineProps({ id: { type: String, required: true } });
const items = dataBaseStore.formatedMeshComponents(props.id);

// Function to select all visible components by default
function selectAllVisibleComponents() {
  const visibleComponents = [];
  items.forEach((category) => {
    category.children.forEach((component) => {
      // Assuming all components are visible by default
      visibleComponents.push(component);
    });
  });
  dataBaseStore.db[props.id].mesh_components_selection = visibleComponents;
}

onMounted(() => {
  selectAllVisibleComponents();
  console.log(
    "onMounted dataBaseStore.db[props.id].mesh_components_selection",
    dataBaseStore.db[props.id].mesh_components_selection
  );
});

watch(
  () => dataBaseStore.db[props.id].mesh_components_selection,
  (current, previous) => {
    console.log("watch", current, previous);
    if (!previous) previous = [];
    const added = current.filter(
      (item) => !previous.some((p) => p.id === item.id)
    );
    const removed = previous.filter(
      (item) => !current.some((c) => c.id === item.id)
    );

    const [added_corners, added_lines, added_surfaces, added_blocks] =
      sortMeshComponents(added);

    console.log(
      "added",
      added_corners,
      added_lines,
      added_surfaces,
      added_blocks
    );

    if (added_corners.length > 0)
      dataStyleStore.setCornerVisibility(props.id, added_corners, true);
    if (added_lines.length > 0)
      dataStyleStore.setLineVisibility(props.id, added_lines, true);
    if (added_surfaces.length > 0)
      dataStyleStore.setSurfaceVisibility(props.id, added_surfaces, true);
    if (added_blocks.length > 0)
      dataStyleStore.setBlockVisibility(props.id, added_blocks, true);

    const [removed_corners, removed_lines, removed_surfaces, removed_blocks] =
      sortMeshComponents(removed);
    console.log(
      "removed",
      removed_corners,
      removed_lines,
      removed_surfaces,
      removed_blocks
    );

    if (removed_corners.length > 0)
      dataStyleStore.setCornerVisibility(props.id, removed_corners, false);
    if (removed_lines.length > 0)
      dataStyleStore.setLineVisibility(props.id, removed_lines, false);
    if (removed_surfaces.length > 0)
      dataStyleStore.setSurfaceVisibility(props.id, removed_surfaces, false);
    if (removed_blocks.length > 0)
      dataStyleStore.setBlockVisibility(props.id, removed_blocks, false);
  },
  { immediate: true, deep: true }
);

function sortMeshComponents(items) {
  var corner_ids = [],
    line_ids = [],
    surface_ids = [],
    block_ids = [];
  for (const item of items) {
    if (item.category === "Corner") corner_ids.push(item.id);
    if (item.category === "Line") line_ids.push(item.id);
    if (item.category === "Surface") surface_ids.push(item.id);
    if (item.category === "Block") block_ids.push(item.id);
  }
  return [corner_ids, line_ids, surface_ids, block_ids];
}
</script>

<style scoped>
.treeview-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
}

.transparent-treeview {
  background-color: transparent;
  margin: 4px 0;
}
</style>
