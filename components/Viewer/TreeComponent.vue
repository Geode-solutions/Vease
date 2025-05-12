<template>
  <v-treeview
    v-model:selected="mesh_components_selection"
    :items="items"
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
const dataStyleStore = useDataStyleStore();
const dataBaseStore = useDataBaseStore();

const props = defineProps({ id: { type: String, required: true } });

const items = dataBaseStore.formatedMeshComponents(props.id);
console.log("items", items);
const mesh_components_selection = ref(
  dataStyleStore.visibleMeshComponents(props.id)
);
console.log("mesh_components_selection", mesh_components_selection);

function compareSelections(current, previous) {
  const added = current.filter((item) => !previous.includes(item));
  const removed = previous.filter((item) => !current.includes(item));
  return { added, removed };
}

watch(
  mesh_components_selection,
  (current, previous) => {
    console.log("mesh_components_selection changed", current, previous);
    if (!previous) previous = [];
    else {
      const { added, removed } = compareSelections(current, previous);
      console.log("added", added, "removed", removed);

      const [added_corners, added_lines, added_surfaces, added_blocks] =
        sortMeshComponents(added);
      const [removed_corners, removed_lines, removed_surfaces, removed_blocks] =
        sortMeshComponents(removed);

      console.log(
        "added_corners",
        added_corners,
        "added_lines",
        added_lines,
        "added_surfaces",
        added_surfaces,
        "added_blocks",
        added_blocks,
        "removed_corners",
        removed_corners,
        "removed_lines",
        removed_lines,
        "removed_surfaces",
        removed_surfaces,
        "removed_blocks",
        removed_blocks
      );

      if (added_corners.length > 0)
        dataStyleStore.setCornerVisibility(props.id, added_corners, true);
      if (added_lines.length > 0)
        dataStyleStore.setLineVisibility(props.id, added_lines, true);
      if (added_surfaces.length > 0)
        dataStyleStore.setSurfaceVisibility(props.id, added_surfaces, true);
      if (added_blocks.length > 0)
        dataStyleStore.setBlockVisibility(props.id, added_blocks, true);

      if (removed_corners.length > 0)
        dataStyleStore.setCornerVisibility(props.id, removed_corners, false);
      if (removed_lines.length > 0)
        dataStyleStore.setLineVisibility(props.id, removed_lines, false);
      if (removed_surfaces.length > 0)
        dataStyleStore.setSurfaceVisibility(props.id, removed_surfaces, false);
      if (removed_blocks.length > 0)
        dataStyleStore.setBlockVisibility(props.id, removed_blocks, false);
    }
  },
  { immediate: true, deep: true }
);

function sortMeshComponents(items) {
  var corner_ids = [],
    line_ids = [],
    surface_ids = [],
    block_ids = [];
  for (const item of items) {
    console.log("item", item);
    const item_type = dataBaseStore.meshComponentType(props.id, item);
    console.log("item_type", item_type);
    if (item_type === "corner") corner_ids.push(item);
    else if (item_type === "line") line_ids.push(item);
    else if (item_type === "surface") surface_ids.push(item);
    else if (item_type === "block") block_ids.push(item);
  }

  console.log(
    "sortMeshComponents",
    corner_ids,
    line_ids,
    surface_ids,
    block_ids
  );
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
