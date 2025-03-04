<template>
  <v-row
    v-for="(texture, index) in internal_textures"
    :key="texture"
    justify="left"
    align="center"
  >
    {{ internal_textures[index] }}
    <!-- <v-spacer />
    <v-col cols="1" class="pa-0">
      <v-icon
        v-if="textures.length > 1"
        icon="mdi-minus"
        size="20"
        v-tooltip:bottom="'Remove texture'"
        @click="textures.splice(index, 1)"
      />
    </v-col> -->
    <ViewerOptionsTextureItem
      :texture_name="internal_textures[index].texture_name"
      :texture_file_name="internal_textures[index].texture_file_name"
      @update_texture_name="update_texture_name_event($event, index)"
      @update_texture_file_name="update_texture_file_name_event($event, index)"
      :id="id"
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
          internal_textures.push(
            reactive({ texture_name: '', texture_file_name: '' })
          )
        "
      />
    </v-col>
  </v-row>
</template>

<script setup>
const emit = defineEmits(["update:textures"]);
const internal_textures = ref([]);

const textures = defineModel();

const props = defineProps({
  id: { type: String, required: true },
});

watch(internal_textures, (value) => {
  console.log("TEXTURES TEST", value);
});

function update_texture_name_event($event, index) {
  console.log("update_texture_name_event", $event, index);
  internal_textures.value[index].texture_name = $event;
  // emit("update:textures", internal_textures.value);
  textures.value = internal_textures.value;
}

function update_texture_file_name_event($event, index) {
  console.log("update_texture_file_name_event", $event, index);
  internal_textures.value[index].texture_file_name = $event;
  // emit("update:textures", internal_textures.value);
  textures.value = internal_textures.value;
}
</script>
