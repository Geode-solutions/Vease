<template>
  <v-row
    v-for="(texture, index) in internal_textures"
    :key="texture"
    align="center"
  >
    <br />

    <v-col cols="1" class="pa-0">
      <v-icon
        v-if="internal_textures.length > 1"
        icon="mdi-minus"
        size="20"
        v-tooltip:bottom="'Remove texture'"
        @click="internal_textures.splice(index, 1)"
      />
    </v-col>
    <ViewerOptionsTextureItem
      :id="id"
      :texture_name="internal_textures[index].texture_name"
      :texture_file_name="internal_textures[index].texture_file_name"
      @update_value="update_value_event($event, index)"
    />
  </v-row>
  <v-row>
    <v-spacer />
    <v-col cols="3">
      <v-icon
        v-if="internal_textures.length < 4"
        icon="mdi-plus"
        v-tooltip:bottom="'Add a texture'"
        size="20"
        @click="
          internal_textures.push({ texture_name: '', texture_file_name: '' })
        "
      />
    </v-col>
  </v-row>
</template>

<script setup>
const textures = defineModel();

const internal_textures = ref([]);

const props = defineProps({
  id: { type: String, required: true },
});

onMounted(() => {
  if (textures.value != null) {
    internal_textures.value = textures.value;
  } else {
    internal_textures.value = [{ texture_name: "", texture_file_name: "" }];
  }
});

function update_value_event($event, index) {
  internal_textures.value[index][$event.key] = $event.value;
  const filtered = internal_textures.value.filter((texture) => {
    return texture.texture_name != "" && texture.texture_file_name != "";
  });
  if (filtered.length != 0) {
    textures.value = filtered;
  }
}
</script>
