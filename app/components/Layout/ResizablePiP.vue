<script setup>
import { useDraggable, useStorage, useWindowSize } from "@vueuse/core";

const RATIO = 0.9;

const { defaultWidth, defaultHeight, minWidth, minHeight, storageKey, edgeSize, margin, zIndex } =
  defineProps({
    defaultWidth: { type: Number, default: 560 },
    defaultHeight: { type: Number, default: 480 },
    minWidth: { type: Number, default: 400 },
    minHeight: { type: Number, default: 300 },
    storageKey: { type: String, default: undefined },
    edgeSize: { type: Number, default: 6 },
    margin: { type: Number, default: 16 },
    zIndex: { type: Number, default: 1500 },
  });

const { width: winWidth, height: winHeight } = useWindowSize();

const maxWidth = computed(() => Math.floor(winWidth.value * RATIO));
const maxHeight = computed(() => Math.floor(winHeight.value * RATIO));

const savedPosition = storageKey
  ? useStorage(`${storageKey}-position`, { x: undefined, y: undefined })
  : ref({ x: undefined, y: undefined });

const savedSize = storageKey
  ? useStorage(`${storageKey}-size`, {
      width: defaultWidth,
      height: defaultHeight,
    })
  : ref({ width: defaultWidth, height: defaultHeight });

const pipWidth = ref(savedSize.value.width);
const pipHeight = ref(savedSize.value.height);

const initialX = computed(() =>
  savedPosition.value.x !== null ? savedPosition.value.x : winWidth.value - pipWidth.value - margin,
);
const initialY = computed(() =>
  savedPosition.value.y !== null
    ? savedPosition.value.y
    : winHeight.value - pipHeight.value - margin,
);

const pipRef = ref(undefined);
const dragHandle = ref(undefined);

const { x, y } = useDraggable(pipRef, {
  handle: dragHandle,
  initialValue: { x: initialX.value, y: initialY.value },
  onMove({ x: newX, y: newY }) {
    savedPosition.value = { x: newX, y: newY };
  },
});

const isResizing = ref(false);
let resizeEdge = "";
let resizeStartPointerX = 0;
let resizeStartPointerY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;
let resizeStartX = 0;
let resizeStartY = 0;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function startResize(event, edge) {
  event.preventDefault();
  event.stopPropagation();
  isResizing.value = true;
  resizeEdge = edge;
  resizeStartPointerX = event.clientX;
  resizeStartPointerY = event.clientY;
  resizeStartWidth = pipWidth.value;
  resizeStartHeight = pipHeight.value;
  resizeStartX = x.value;
  resizeStartY = y.value;
  document.addEventListener("pointermove", onResizeMove);
  document.addEventListener("pointerup", onResizeEnd);
}

function onResizeMove(event) {
  const deltaX = event.clientX - resizeStartPointerX;
  const deltaY = event.clientY - resizeStartPointerY;

  if (resizeEdge.includes("right")) {
    pipWidth.value = clamp(resizeStartWidth + deltaX, minWidth, maxWidth.value);
  }
  if (resizeEdge.includes("bottom")) {
    pipHeight.value = clamp(resizeStartHeight + deltaY, minHeight, maxHeight.value);
  }
  if (resizeEdge.includes("left")) {
    const newWidth = clamp(resizeStartWidth - deltaX, minWidth, maxWidth.value);
    const widthDelta = resizeStartWidth - newWidth;
    x.value = resizeStartX + widthDelta;
    pipWidth.value = newWidth;
  }
  if (resizeEdge.includes("top")) {
    const newHeight = clamp(resizeStartHeight - deltaY, minHeight, maxHeight.value);
    const heightDelta = resizeStartHeight - newHeight;
    y.value = resizeStartY + heightDelta;
    pipHeight.value = newHeight;
  }
}

function onResizeEnd() {
  isResizing.value = false;
  savedSize.value = { width: pipWidth.value, height: pipHeight.value };
  savedPosition.value = { x: x.value, y: y.value };
  document.removeEventListener("pointermove", onResizeMove);
  document.removeEventListener("pointerup", onResizeEnd);
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
        zIndex: zIndex,
        transition: isResizing ? 'none' : 'filter 0.2s ease',
        userSelect: isResizing ? 'none' : undefined,
      }"
      class="resizable-pip"
    >
      <!-- Edge resize zones -->
      <div
        class="position-absolute"
        :style="{
          top: 0,
          left: 0,
          right: 0,
          height: `${edgeSize}px`,
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
          height: `${edgeSize}px`,
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
          width: `${edgeSize}px`,
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
          width: `${edgeSize}px`,
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
        class="resizable-pip-container fill-height overflow-hidden"
        rounded="xl"
        :style="{ border: '1px solid rgba(255, 255, 255, 0.12)' }"
      >
        <div ref="dragHandle" class="resizable-pip-handle">
          <slot name="handle" />
        </div>
        <div class="resizable-pip-content overflow-hidden">
          <slot />
        </div>
      </GlassCard>
    </div>
  </Teleport>
</template>

<style scoped>
.resizable-pip {
  filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.5));
}

.resizable-pip-handle {
  cursor: grab;
}

.resizable-pip-handle:active {
  cursor: grabbing;
}

.resizable-pip-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.resizable-pip-content {
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
