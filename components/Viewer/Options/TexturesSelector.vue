<template>
  <v-row
    v-for="(texture, index) in textures"
    :key="texture"
    justify="left"
    align="center"
  >
    {{ textures[index] }}
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
    <ViewerOptionsTextureItem v-model="textures[index]" :id="id" />
  </v-row>
  <v-row>
    <v-spacer />
    <v-col cols="3">
      <v-icon
        v-if="textures.length < 4"
        icon="mdi-plus"
        v-tooltip:bottom="'Add a texture'"
        size="20"
        @click="textures.push({ texture_name: '', texture_file_name: '' })"
      />
    </v-col>
  </v-row>
</template>

<script setup>
const textures = defineModel();

const props = defineProps({
  id: { type: String, required: true },
});

watch(textures, (value) => {
  console.log("textures", value);
});
</script>
