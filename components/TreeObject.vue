<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <v-treeview
          v-model:selected="selection"
          select-strategy="classic"
          item-value="id"
          return-object
          :items="treeviewStore.items"
          selectable
          class="transparent-treeview"
          selected
        >
        </v-treeview>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.transparent-treeview {
  background-color: transparent;
  color: rgb(0, 0, 0);
}
</style>

<script setup>
import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const treeviewStore = useTreeviewStore();

const { selection } = toRefs(treeviewStore);

async function toggle_object_visibility(id, is_visible) {
  const result = validate_schema(
    viewer_schemas.opengeodeweb_viewer.toggle_object_visibility,
    {
      id,
      is_visible,
    }
  );

  await viewer_call({
    schema: viewer_schemas.opengeodeweb_viewer.toggle_object_visibility,
    params: {
      id,
      is_visible,
    },
  });
}

function compare_selections(value, oldvalue) {
  const added = value.filter((item) => !oldvalue.includes(item));
  const removed = oldvalue.filter((item) => !value.includes(item));
  return { added, removed };
}

watch(selection, (value, oldvalue) => {
  const { added, removed } = compare_selections(value, oldvalue);
  for (const file of added) {
    toggle_object_visibility(file.id, true);
  }
  for (const file of removed) {
    toggle_object_visibility(file.id, false);
  }
});
</script>
