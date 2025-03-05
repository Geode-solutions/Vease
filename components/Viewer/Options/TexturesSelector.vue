<template>
  <v-row
    v-for="(texture, index) in internal_textures"
    :key="texture"
    justify="left"
    align="center"
  >
    <br />
    <v-spacer />
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

const internal_textures = textures.value;

const props = defineProps({
  id: { type: String, required: true },
});

function update_value_event($event, index) {
  console.log("update_texture_file_name_event", $event, index);
  console.log("textures.value", textures.value);

  internal_textures[index][$event.key] = $event.value;
  const filtered = internal_textures.filter((texture) => {
    console.log("filter texture", texture);
    return texture.texture_name != "" && texture.texture_file_name != "";
  });
  console.log("filtered", filtered.length);

  if (filtered.length != 0) {
    textures.value = filtered;
    console.log("erase");
  }
  console.log("textures.value", textures.value);
}
</script>
