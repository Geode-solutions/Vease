<script setup>
  const { selectedCount } = defineProps({
    selectedCount: {
      type: Number,
      default: 0,
    },
  })

  defineEmits(["delete", "clear"])
</script>

<template>
  <v-expand-transition>
    <v-sheet
      v-if="selectedCount > 0"
      class="mb-4 pa-3 border-thin rounded-lg"
      color="transparent"
      rounded="lg"
    >
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-2">
          <span class="text-subtitle-2 text-white px-2"
            >{{ selectedCount }} items selected</span
          >
          <v-divider vertical class="mx-2" />
          <v-btn
            prepend-icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="$emit('delete')"
          >
            Delete
          </v-btn>
        </div>
        <v-btn
          icon="mdi-close"
          size="x-small"
          variant="text"
          color="white"
          @click="$emit('clear')"
        />
      </div>
    </v-sheet>
  </v-expand-transition>
</template>
