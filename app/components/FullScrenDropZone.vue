<template>
  <v-overlay
    v-model="UIStore.showDropZone"
    transition="dropzone-transition"
    @keyup.esc="UIStore.disableDropZone()"
    @click:outside="UIStore.disableDropZone()"
    height="100%"
    width="100%"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    role="dialog"
    aria-modal="true"
    aria-label="Zone de dépôt de fichiers"
    class="dropzone-overlay"
  >
    <v-row no-gutters class="fill-height">
      <v-col cols="12" class="fill-height justify-center align-center d-flex">
        <v-card
          align="center"
          justify="center"
          height="100%"
          width="100%"
          color="transparent"
          class="pa-5 justify-center align-center d-flex"
          @drop="onDrop"
        >
          <v-card
            width="90%"
            max-width="600px"
            height="auto"
            class="pa-10 dropzone-card text-center"
            tabindex="0"
            aria-label="Déposez vos fichiers ici"
            color="white"
            :class="{ dragging: isDragging }"
          >
            <v-icon size="56" color="primary" class="mb-4 pulse-animation"
              >mdi-cloud-upload-outline</v-icon
            >
            <h2 class="text-h5 font-weight-medium mb-2 text-black">
              Drag and drop your files here
            </h2>
            <p class="text-body-1 text-grey-darken-2">
              Import at least one file
            </p>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-overlay>
</template>

<script setup>
  import { useFeedbackStore } from "@ogw_front/stores/feedback"
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()
  const feedbackStore = useFeedbackStore()

  const isDragging = ref(false)
  let dragLeaveTimeout = null

  const onDragOver = (e) => {
    e.preventDefault()
    isDragging.value = true
    clearTimeout(dragLeaveTimeout)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    isDragging.value = false

    dragLeaveTimeout = setTimeout(() => {
      if (!isDragging.value) {
        UIStore.setShowDropZone(false)
      }
    }, 300)
  }

  const onDrop = (e) => {
    e.preventDefault()
    isDragging.value = false
    clearTimeout(dragLeaveTimeout)

    if (!e.dataTransfer) {
      feedbackStore.add_error(
        500,
        "/internal",
        "Internal error",
        "No file dropped.",
      )
      UIStore.setShowDropZone(false)
      return
    }

    const files = e.dataTransfer.files

    if (files.length === 0) {
      feedbackStore.add_error(
        500,
        "/internal",
        "Internal error",
        "No file dropped.",
      )
    } else {
      feedbackStore.add_success(`${files.length} file(s) dropped`)
      UIStore.setDroppedFiles(Array.from(files))
      UIStore.setShowStepper(true)
    }

    UIStore.setShowDropZone(false)
  }
</script>

<style scoped>
  .dropzone-overlay {
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.5);
  }

  .dropzone-card {
    border: 2px dashed var(--v-primary-base);
    border-radius: 16px;
    background-color: #ffffff;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .dropzone-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }

  .dropzone-card.dragging {
    border-color: var(--v-success-base);
    background-color: rgba(46, 125, 50, 0.05);
    transform: scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }

  .dropzone-transition-enter-active,
  .dropzone-transition-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .dropzone-transition-enter-from,
  .dropzone-transition-leave-to {
    opacity: 0;
    transform: scale(0.98);
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
