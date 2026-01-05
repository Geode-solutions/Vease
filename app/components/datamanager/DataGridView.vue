<template>
  <div class="grid-container">
    <v-row class="mt-2">
      <v-col
        v-for="item in filteredItems"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          variant="outlined"
          class="glass-card h-100 cursor-pointer"
          :class="{ 'card-selected': isSelected(item) }"
          @click="$emit('toggle-selection', item)"
        >
          <div v-if="isSelected(item)" class="selection-indicator">
            <v-icon color="white" size="20">mdi-check-circle</v-icon>
          </div>

          <v-card-text class="pa-4 text-white">
            <div
              class="text-subtitle-1 font-weight-bold text-truncate mb-2 title-clickable"
              @click.stop="$emit('rename', item)"
            >
              {{ item.name }}
            </div>
            <v-chip
              size="x-small"
              color="primary"
              variant="flat"
              class="mb-3"
              >{{ item.geode_object_type }}</v-chip
            >
            <div class="text-caption text-white-opacity-60">
              {{ formatSmartDate(item.created_at) }}
            </div>
          </v-card-text>

          <v-divider class="border-opacity-10" />

          <v-card-actions class="pa-2">
            <v-btn
              icon
              size="small"
              variant="text"
              color="white"
              @click.stop="$emit('toggle-visibility', item)"
            >
              <v-icon size="20">{{
                item.visible ? "mdi-eye" : "mdi-eye-off"
              }}</v-icon>
              <v-tooltip activator="parent" location="top"
                >Toggle Visibility</v-tooltip
              >
            </v-btn>
            <v-spacer />
            <v-btn
              icon
              size="small"
              variant="text"
              color="white"
              @click.stop="$emit('focus-camera', item)"
            >
              <v-icon size="20">mdi-target</v-icon>
              <v-tooltip activator="parent" location="top"
                >Focus Camera</v-tooltip
              >
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="white"
              @click.stop="$emit('isolate', item)"
            >
              <v-icon size="20">mdi-filter-variant</v-icon>
              <v-tooltip activator="parent" location="top">Isolate</v-tooltip>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="white"
              @click.stop="$emit('rename', item)"
            >
              <v-icon size="20">mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Rename</v-tooltip>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="error"
              @click.stop="$emit('delete', item)"
            >
              <v-icon size="20">mdi-delete</v-icon>
              <v-tooltip activator="parent" location="top">Delete</v-tooltip>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  const props = defineProps({
    items: {
      type: Array,
      required: true,
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    search: {
      type: String,
      default: "",
    },
  })

  defineEmits([
    "toggle-selection",
    "toggle-visibility",
    "focus-camera",
    "isolate",
    "rename",
    "delete",
  ])

  const filteredItems = computed(() => {
    if (!props.search) return props.items
    const lower = props.search.toLowerCase()
    return props.items.filter((i) => i.name?.toLowerCase().includes(lower))
  })

  function isSelected(item) {
    return props.selectedIds.some((selected) => selected.id === item.id)
  }

  function formatSmartDate(dateStr) {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    let relative = ""
    if (diff < 60) relative = "just now"
    else if (diff < 3600) relative = `${Math.floor(diff / 60)}m ago`
    else if (diff < 86400) relative = `${Math.floor(diff / 3600)}h ago`
    else relative = `${Math.floor(diff / 86400)}d ago`
    return `${relative} (${date.toLocaleDateString()})`
  }
</script>

<style scoped>
  .grid-container {
    height: 620px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }

  .grid-container::-webkit-scrollbar {
    width: 8px;
  }

  .grid-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .grid-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  .grid-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .text-white-opacity-60 {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.05) !important;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1) !important;
    transition: all 0.25s ease;
    position: relative;
  }

  .glass-card:hover {
    border-color: rgba(255, 255, 255, 0.25) !important;
    background: rgba(255, 255, 255, 0.08) !important;
    transform: translateY(-2px);
  }

  .card-selected {
    border-color: rgb(var(--v-theme-primary)) !important;
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.2) 0%,
      rgba(var(--v-theme-primary), 0.1) 100%
    ) !important;
    box-shadow:
      0 0 0 1px rgba(var(--v-theme-primary), 0.3),
      0 8px 32px rgba(var(--v-theme-primary), 0.2);
  }

  .card-selected:hover {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.25) 0%,
      rgba(var(--v-theme-primary), 0.15) 100%
    ) !important;
  }

  .selection-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    background: rgba(var(--v-theme-primary), 0.9);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .title-clickable {
    transition: color 0.2s ease;
    cursor: pointer;
  }

  .title-clickable:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }

  .cursor-pointer {
    cursor: pointer;
  }
</style>
