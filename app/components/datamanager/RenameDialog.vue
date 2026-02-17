<script setup>
  import GlassCard from "@ogw_front/components/GlassCard"

  const { show, item, initialName } = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    initialName: {
      type: String,
      default: "",
    },
  })

  const emit = defineEmits(["update:show", "confirm"])

  const currentName = ref(initialName)

  watch(
    () => initialName,
    (newVal) => {
      currentName.value = newVal
    },
  )

  function handleConfirm() {
    if (!currentName.value) return
    emit("confirm", currentName.value)
  }
</script>

<template>
  <v-dialog
    :model-value="show"
    @update:model-value="emit('update:show', $event)"
    max-width="400"
  >
    <GlassCard variant="panel" padding="pa-8" :width="400">
      <v-card-title
        class="pb-2 text-h5 font-weight-bold d-flex align-center text-white"
      >
        <v-icon
          icon="mdi-pencil-outline"
          class="mr-3 text-h4"
          color="white"
        ></v-icon>
        Rename Item
      </v-card-title>

      <v-card-subtitle class="ma-0 text-white opacity-80">
        Enter a new name for this object.
      </v-card-subtitle>

      <v-card-text class="pt-8 px-0">
        <v-text-field
          :model-value="currentName"
          @update:model-value="currentName = $event"
          type="text"
          variant="outlined"
          color="white"
          base-color="white"
          bg-color="rgba(255, 255, 255, 0.15)"
          class="mb-4 rounded-lg"
          @keydown.enter="handleConfirm"
          hide-details
          clearable
        >
          <template v-slot:label>
            <span class="text-white opacity-100">Object Name</span>
          </template>
          <template v-slot:prepend-inner>
            <v-icon color="white" class="opacity-100">mdi-format-title</v-icon>
          </template>
        </v-text-field>
      </v-card-text>

      <v-card-actions class="px-0 pb-0 mt-4">
        <v-btn
          variant="text"
          color="white"
          size="large"
          @click="emit('update:show', false)"
          class="text-none rounded-lg"
        >
          <v-icon start>mdi-close-circle-outline</v-icon>
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn
          color="primary"
          size="large"
          variant="flat"
          @click="handleConfirm"
          class="text-none rounded-lg font-weight-bold"
          elevation="4"
        >
          <v-icon start>mdi-check-circle-outline</v-icon>
          Rename
        </v-btn>
      </v-card-actions>
    </GlassCard>
  </v-dialog>
</template>
