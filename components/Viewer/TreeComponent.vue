<template>
  <v-treeview
    v-model:selected="treeviewStore.components_selection"
    :items="mesh_components"
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
const treeviewStore = use_treeview_store();
const dataStyleStore = useDataStyleStore();
const dataBaseStore = useDataBaseStore();

const props = defineProps({ id: { type: String, required: true } });
const mesh_components = ref([]);

function updateMeshComponents() {
  for (const [category, uuids] of Object.entries(
    dataBaseStore.db[props.id].mesh_components
  )) {
    mesh_components.value.push({
      id: category,
      title: category,
      children: uuids.map((uuid) => ({
        id: uuid,
        title: uuid,
        category,
      })),
    });
  }
}

watch(
  () => dataBaseStore.db[props.id].mesh_components,
  () => {
    updateMeshComponents();
  }
);

onMounted(() => {
  updateMeshComponents();
});

watch(
  () => treeviewStore.components_selection,
  (current, previous) => {
    if (!previous) previous = [];
    const added = current.filter(
      (item) => !previous.some((p) => p.id === item.id)
    );
    const removed = previous.filter(
      (item) => !current.some((c) => c.id === item.id)
    );
    added.forEach((item) => {
      dataStyleStore.setModelMeshComponentVisibility(
        props.id,
        item.category,
        item.id,
        true
      );
    });
    removed.forEach((item) => {
      dataStyleStore.setModelMeshComponentVisibility(
        props.id,
        item.category,
        item.id,
        false
      );
    });
  },
  { immediate: true, deep: true }
);
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
