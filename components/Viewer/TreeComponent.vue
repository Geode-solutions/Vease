<template>
  <v-treeview
    v-model:selected="components_selection"
    :items="mesh_components"
    return-object
    class="transparent-treeview"
    item-value="id"
    select-strategy="classic"
    selectable
  >
    <template #title="{ item }">
      <span class="treeview-item">{{ item.id }}</span>
    </template>
  </v-treeview>
</template>

<script setup>
const treeviewStore = use_treeview_store();
const dataStyleStore = useDataStyleStore();
const dataBaseStore = useDataBaseStore();
const { components_selection } = storeToRefs(treeviewStore);

const props = defineProps({ id: { type: String, required: true } });

const { db } = storeToRefs(dataBaseStore);

console.log("db", db);
const previousSelection = ref([]);

const mesh_components = computed(() => {
  console.log("db.value[props.id]", db.value[props.id]);
  console.log("mesh_components", db.value[props.id].mesh_components);
  const formated_mesh_components = [];
  for (const [category, uuids] of Object.entries(
    db.value[props.id].mesh_components
  )) {
    formated_mesh_components.push({
      id: category,
      name: category,
      children: uuids.map((uuid) => ({
        id: uuid,
        name: uuid,
        category,
      })),
    });
  }
  return formated_mesh_components;
});

console.log("mesh_components", mesh_components);

watch(
  components_selection,
  (current) => {
    const prev = previousSelection.value || [];
    const added = current.filter((item) => !prev.some((p) => p.id === item.id));
    const removed = prev.filter(
      (item) => !current.some((c) => c.id === item.id)
    );
    console.log("current", current);
    console.log("added", added);
    console.log("removed", removed);
    added.forEach((item) => {
      console.log("added item", item);
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

    previousSelection.value = [...current];
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
