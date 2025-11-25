<template>
  <v-card :width="500" flat>
    <v-card-title
      class="text-h4 text-primary pa-4 font-weight-bold d-flex align-center"
    >
      <v-icon icon="mdi-puzzle" class="mr-3"></v-icon>
      Extensions
    </v-card-title>
    <v-card-subtitle class="ma-0 text-medium">
      Load extension files (.es.js) to enhance functionality.
    </v-card-subtitle>
    <v-card-text class="pt-6">
      <v-file-input
        v-model="files"
        label="Drop extension files here"
        accept=".es.js"
        prepend-icon="mdi-file-upload"
        variant="outlined"
        multiple
        show-size
        @update:model-value="handleFileChange"
      >
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip size="small" label color="primary" class="mr-2">
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>

      <v-list v-if="files.length > 0" class="mt-4" lines="two">
        <v-list-subheader>Preview</v-list-subheader>
        <v-list-item
          v-for="(file, index) in files"
          :key="index"
          :title="file.name"
          :subtitle="formatSize(file.size)"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-file-code-outline" color="primary"></v-icon>
          </template>
          <template v-slot:append>
             <v-icon icon="mdi-check-circle" color="success"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const files = ref([])

const handleFileChange = (newFiles) => {
  // Logic to process files can be added here
  console.log('Files loaded:', newFiles)
}

const formatSize = (size) => {
  if (size < 1024) return size + ' B'
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  )
}
</script>

<style scoped>
/* Add any specific styles here if needed, matching CreateTools.vue */
</style>
