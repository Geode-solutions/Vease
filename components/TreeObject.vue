<template>
  <div
    style="
      position: absolute;
      z-index: 2;
      left: 0;
      top: 0;
      background-color: transparent;
      border-radius: 16px;
    "
  >
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
  </div>
</template>

<style scoped>
.transparent-treeview {
  background-color: transparent;
  color: rgb(0, 0, 0);
}
</style>

<script setup>
import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const treeviewStore = use_treeview_store();

const { selection } = toRefs(treeviewStore);

async function toggle_object_visibility(id, visibility) {
  await viewer_call({
    schema: viewer_schemas.opengeodeweb_viewer.model.set_components_visibility,
    params: {
      id,
      visibility,
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
