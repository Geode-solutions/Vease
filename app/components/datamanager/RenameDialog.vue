<template>
  <v-dialog
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    max-width="400"
  >
    <v-card rounded="xl" class="bg-white text-center overflow-hidden">
      <div class="bg-primary w-100" style="height: 6px"></div>
      <v-avatar color="blue-lighten-5" size="64" class="mt-8 mx-auto"
        ><v-icon color="primary" size="32">mdi-pencil-outline</v-icon></v-avatar
      >
      <v-card-title class="text-h5 font-weight-bold text-grey-darken-4 pt-4"
        >Rename Item</v-card-title
      >
      <v-card-text class="px-8">
        <v-text-field
          :model-value="currentName"
          @update:model-value="currentName = $event"
          label="New Name"
          variant="outlined"
          color="primary"
          class="mt-4"
          @keydown.enter="handleConfirm"
        />
      </v-card-text>
      <v-card-actions class="px-8 pb-8"
        ><v-spacer /><v-btn variant="text" @click="$emit('update:show', false)"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          variant="flat"
          class="px-8 rounded-pill"
          @click="handleConfirm"
          >Rename</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>

<script setup>
  const props = defineProps({
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

  const currentName = ref(props.initialName)

  watch(
    () => props.initialName,
    (newVal) => {
      currentName.value = newVal
    },
  )

  function handleConfirm() {
    if (!currentName.value) return
    emit("confirm", currentName.value)
  }
</script>
