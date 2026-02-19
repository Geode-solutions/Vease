<script setup>
  import { useFeedbackStore } from "@ogw_front/stores/feedback"
  import { useUIStore } from "@vease/stores/UI"

  const UI_TIMEOUT = 300
  const ERROR_500 = 500

  const UIStore = useUIStore()
  const feedbackStore = useFeedbackStore()

  const isDragging = ref(false)
  let dragLeaveTimeout = null

  function onDragOver(event) {
    event.preventDefault()
    isDragging.value = true
    clearTimeout(dragLeaveTimeout)
  }

  function onDragLeave(event) {
    event.preventDefault()
    isDragging.value = false

    dragLeaveTimeout = setTimeout(() => {
      if (!isDragging.value) {
        UIStore.setShowDropZone(false)
      }
    }, UI_TIMEOUT)
  }

  function onDrop(event) {
    event.preventDefault()
    isDragging.value = false
    clearTimeout(dragLeaveTimeout)

    if (!event.dataTransfer) {
      feedbackStore.add_error(
        ERROR_500,
        "/internal",
        "Internal error",
        "No file dropped.",
      )
      UIStore.setShowDropZone(false)
      return
    }

    const { files } = event.dataTransfer

    if (files.length === 0) {
      feedbackStore.add_error(
        ERROR_500,
        "/internal",
        "Internal error",
        "No file dropped.",
      )
    } else {
      feedbackStore.add_success(`${files.length} file(s) dropped`)
      UIStore.setDroppedFiles([...files])
      UIStore.setShowStepper(true)
    }

    UIStore.setShowDropZone(false)
  }
</script>

<template>
  <v-overlay
    v-model="UIStore.showDropZone"
    @keyup.esc="UIStore.disableDropZone()"
    @click:outside="UIStore.disableDropZone()"
    class="align-center justify-center dropzone-overlay"
    persistent
    scrim="black"
  >
    <div
      class="fill-height d-flex align-center justify-center"
      style="width: 100vw; height: 100vh"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop="onDrop"
    >
      <v-card
        width="90%"
        max-width="600px"
        class="pa-10 dropzone-card text-center rounded-xl"
        elevation="12"
        :class="{ dragging: isDragging }"
      >
        <v-icon size="64" color="primary" class="mb-6 pulse-animation"
          >mdi-cloud-upload-outline</v-icon
        >
        <h2 class="text-h4 font-weight-bold mb-3 text-black font-michroma">
          Drop files here
        </h2>
        <p class="text-body-1 text-grey-darken-1">Add data to your project</p>
      </v-card>
    </div>
  </v-overlay>
</template>

<style scoped>
  .dropzone-overlay {
    backdrop-filter: blur(8px);
  }

  .dropzone-card {
    border: 3px dashed rgb(var(--v-theme-primary));
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dropzone-card.dragging {
    border-color: rgb(var(--v-theme-success));
    background-color: rgba(rgb(var(--v-theme-success)), 0.05);
    transform: scale(1.05);
  }

  .pulse-animation {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
