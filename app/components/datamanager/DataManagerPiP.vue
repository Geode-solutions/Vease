<script setup>
  import { useDraggable, useWindowSize, useStorage } from "@vueuse/core"
  import GlassCard from "@ogw_front/components/GlassCard"
  import DataManagerContent from "@vease/components/datamanager/DataManagerContent.vue"
  import { useUIStore } from "@vease/stores/UI"

  const UIStore = useUIStore()

  const DEFAULT_WIDTH = 560
  const DEFAULT_HEIGHT = 480
  const MIN_WIDTH = 690
  const MIN_HEIGHT = 350
  const EDGE_SIZE = 6
  const MARGIN = 16

  const { width: winWidth, height: winHeight } = useWindowSize()

  const maxWidth = computed(() => Math.floor(winWidth.value * 0.9))
  const maxHeight = computed(() => Math.floor(winHeight.value * 0.9))

  const savedPosition = useStorage("datamanager-pip-position", {
    x: null,
    y: null,
  })

  const savedSize = useStorage("datamanager-pip-size", {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  })

  const pipWidth = ref(savedSize.value.width)
  const pipHeight = ref(savedSize.value.height)

  const initialX = computed(() =>
    savedPosition.value.x !== null
      ? savedPosition.value.x
      : winWidth.value - pipWidth.value - MARGIN,
  )
  const initialY = computed(() =>
    savedPosition.value.y !== null
      ? savedPosition.value.y
      : winHeight.value - pipHeight.value - MARGIN,
  )

  const pipRef = ref(null)
  const dragHandle = ref(null)

  const { x, y } = useDraggable(pipRef, {
    handle: dragHandle,
    initialValue: { x: initialX.value, y: initialY.value },
    onMove({ x: newX, y: newY }) {
      savedPosition.value = { x: newX, y: newY }
    },
  })

  const isResizing = ref(false)
  let resizeEdge = ""
  let resizeStartPointerX = 0
  let resizeStartPointerY = 0
  let resizeStartWidth = 0
  let resizeStartHeight = 0
  let resizeStartX = 0
  let resizeStartY = 0

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
  }

  function startResize(event, edge) {
    event.preventDefault()
    event.stopPropagation()
    isResizing.value = true
    resizeEdge = edge
    resizeStartPointerX = event.clientX
    resizeStartPointerY = event.clientY
    resizeStartWidth = pipWidth.value
    resizeStartHeight = pipHeight.value
    resizeStartX = x.value
    resizeStartY = y.value
    document.addEventListener("pointermove", onResizeMove)
    document.addEventListener("pointerup", onResizeEnd)
  }

  function onResizeMove(event) {
    const dx = event.clientX - resizeStartPointerX
    const dy = event.clientY - resizeStartPointerY

    if (resizeEdge.includes("right")) {
      pipWidth.value = clamp(resizeStartWidth + dx, MIN_WIDTH, maxWidth.value)
    }
    if (resizeEdge.includes("bottom")) {
      pipHeight.value = clamp(
        resizeStartHeight + dy,
        MIN_HEIGHT,
        maxHeight.value,
      )
    }
    if (resizeEdge.includes("left")) {
      const newWidth = clamp(resizeStartWidth - dx, MIN_WIDTH, maxWidth.value)
      const widthDelta = resizeStartWidth - newWidth
      x.value = resizeStartX + widthDelta
      pipWidth.value = newWidth
    }
    if (resizeEdge.includes("top")) {
      const newHeight = clamp(
        resizeStartHeight - dy,
        MIN_HEIGHT,
        maxHeight.value,
      )
      const heightDelta = resizeStartHeight - newHeight
      y.value = resizeStartY + heightDelta
      pipHeight.value = newHeight
    }
  }

  function onResizeEnd() {
    isResizing.value = false
    savedSize.value = { width: pipWidth.value, height: pipHeight.value }
    savedPosition.value = { x: x.value, y: y.value }
    document.removeEventListener("pointermove", onResizeMove)
    document.removeEventListener("pointerup", onResizeEnd)
  }

  function expandToFullPage() {
    UIStore.setShowDataManagerPiP(false)
    navigateTo("/data-manager")
  }

  function close() {
    UIStore.setShowDataManagerPiP(false)
  }
</script>

<template>
  <Teleport to="body">
    <div
      ref="pipRef"
      :style="{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: `${pipWidth}px`,
        height: `${pipHeight}px`,
        zIndex: 1500,
        filter: 'drop-shadow(0 8px 32px rgba(0, 0, 0, 0.5))',
        transition: isResizing ? 'none' : 'filter 0.2s ease',
        userSelect: isResizing ? 'none' : undefined,
      }"
    >
      <!-- Edge resize zones -->
      <div
        class="position-absolute"
        :style="{
          top: 0,
          left: 0,
          right: 0,
          height: `${EDGE_SIZE}px`,
          zIndex: 11,
          touchAction: 'none',
          cursor: 'ns-resize',
        }"
        @pointerdown="startResize($event, 'top')"
      />
      <div
        class="position-absolute"
        :style="{
          bottom: 0,
          left: 0,
          right: 0,
          height: `${EDGE_SIZE}px`,
          zIndex: 11,
          touchAction: 'none',
          cursor: 'ns-resize',
        }"
        @pointerdown="startResize($event, 'bottom')"
      />
      <div
        class="position-absolute"
        :style="{
          top: 0,
          bottom: 0,
          left: 0,
          width: `${EDGE_SIZE}px`,
          zIndex: 11,
          touchAction: 'none',
          cursor: 'ew-resize',
        }"
        @pointerdown="startResize($event, 'left')"
      />
      <div
        class="position-absolute"
        :style="{
          top: 0,
          bottom: 0,
          right: 0,
          width: `${EDGE_SIZE}px`,
          zIndex: 11,
          touchAction: 'none',
          cursor: 'ew-resize',
        }"
        @pointerdown="startResize($event, 'right')"
      />

      <!-- Corner resize zones -->
      <div
        class="position-absolute"
        :style="{
          top: 0,
          left: 0,
          width: '12px',
          height: '12px',
          zIndex: 12,
          touchAction: 'none',
          cursor: 'nwse-resize',
        }"
        @pointerdown="startResize($event, 'top-left')"
      />
      <div
        class="position-absolute"
        :style="{
          top: 0,
          right: 0,
          width: '12px',
          height: '12px',
          zIndex: 12,
          touchAction: 'none',
          cursor: 'nesw-resize',
        }"
        @pointerdown="startResize($event, 'top-right')"
      />
      <div
        class="position-absolute"
        :style="{
          bottom: 0,
          left: 0,
          width: '12px',
          height: '12px',
          zIndex: 12,
          touchAction: 'none',
          cursor: 'nesw-resize',
        }"
        @pointerdown="startResize($event, 'bottom-left')"
      />
      <div
        class="position-absolute"
        :style="{
          bottom: 0,
          right: 0,
          width: '12px',
          height: '12px',
          zIndex: 12,
          touchAction: 'none',
          cursor: 'nwse-resize',
        }"
        @pointerdown="startResize($event, 'bottom-right')"
      />

      <GlassCard
        variant="panel"
        padding="pa-0"
        class="fill-height overflow-hidden"
        rounded="xl"
        :style="{ border: '1px solid rgba(255, 255, 255, 0.12)' }"
      >
        <div
          ref="dragHandle"
          class="pip-header d-flex align-center px-4"
          style="height: 40px; min-height: 40px; user-select: none"
        >
          <v-icon size="18" color="primary" class="mr-2">mdi-database</v-icon>
          <span class="text-subtitle-2 font-weight-bold text-white"
            >Data Manager</span
          >
          <v-spacer />
          <v-btn
            icon
            size="x-small"
            variant="text"
            color="white"
            @click="expandToFullPage"
          >
            <v-icon size="16">mdi-arrow-expand</v-icon>
            <v-tooltip activator="parent" location="top">Full screen</v-tooltip>
          </v-btn>
          <v-btn
            icon
            size="x-small"
            variant="text"
            color="white"
            @click="close"
          >
            <v-icon size="16">mdi-close</v-icon>
            <v-tooltip activator="parent" location="top">Close</v-tooltip>
          </v-btn>
        </div>

        <div class="overflow-hidden" style="height: calc(100% - 40px)">
          <DataManagerContent compact />
        </div>
      </GlassCard>
    </div>
  </Teleport>
</template>

<style scoped>
  .pip-header {
    cursor: grab;
  }

  .pip-header:active {
    cursor: grabbing;
  }
</style>
