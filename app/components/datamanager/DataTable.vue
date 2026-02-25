<script setup>
  const SECONDS_IN_MINUTE = 60
  const SECONDS_IN_HOUR = 3600
  const SECONDS_IN_DAY = 86400
  const MILLISECONDS_TO_SECONDS = 1000

  const props = defineProps({
    items: { type: Array, required: true },
    search: { type: String, default: "" },
    compact: { type: Boolean, default: false },
  })

  const selectedIds = defineModel("selectedIds", {
    type: Array,
    default: () => [],
  })

  const emit = defineEmits([
    "toggle-visibility",
    "focus-camera",
    "isolate",
    "rename",
    "delete",
  ])

  // Filter items by search (case-insensitive on name)
  const filteredItems = computed(() => {
    if (!props.search) return props.items
    const q = props.search.toLowerCase()
    return props.items.filter((item) => item.name?.toLowerCase().includes(q))
  })

  const isAllSelected = computed(() => {
    return (
      filteredItems.value.length > 0 &&
      filteredItems.value.every((item) =>
        selectedIds.value.some((s) => s.id === item.id),
      )
    )
  })

  const isSomeSelected = computed(() => {
    return selectedIds.value.length > 0 && !isAllSelected.value
  })

  function isItemSelected(item) {
    return selectedIds.value.some((s) => s.id === item.id)
  }

  function toggleItem(item) {
    if (isItemSelected(item)) {
      selectedIds.value = selectedIds.value.filter((s) => s.id !== item.id)
    } else {
      selectedIds.value = [...selectedIds.value, item]
    }
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      selectedIds.value = []
    } else {
      selectedIds.value = [...filteredItems.value]
    }
  }

  function formatSmartDate(dateStr) {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const diff = Math.floor((Date.now() - date) / MILLISECONDS_TO_SECONDS)

    let relative = ""
    if (diff < SECONDS_IN_MINUTE) {
      relative = "just now"
    } else if (diff < SECONDS_IN_HOUR) {
      relative = `${Math.floor(diff / SECONDS_IN_MINUTE)}m ago`
    } else if (diff < SECONDS_IN_DAY) {
      relative = `${Math.floor(diff / SECONDS_IN_HOUR)}h ago`
    } else {
      relative = `${Math.floor(diff / SECONDS_IN_DAY)}d ago`
    }

    return `${relative} (${date.toLocaleDateString()})`
  }
</script>

<template>
  <div
    class="d-flex flex-column fill-height overflow-hidden position-relative pt-1"
  >
    <!-- Custom Fixed Header (Unified Grid) -->
    <div class="custom-table-header flex-shrink-0 table-grid-row">
      <div class="grid-cell d-flex justify-center py-3">
        <v-checkbox-btn
          :model-value="isAllSelected"
          :indeterminate="isSomeSelected"
          color="white"
          @update:model-value="toggleSelectAll"
        />
      </div>
      <div class="grid-cell header-label py-3">NAME</div>
      <div class="grid-cell header-label text-center py-3">TYPE</div>
      <div class="grid-cell header-label text-center py-3">DATE</div>
      <div class="grid-cell header-label text-center py-3">VISIBILITY</div>
      <div class="grid-cell header-label text-end py-3 pr-2">ACTIONS</div>
    </div>

    <!-- Scrollable content area with mask -->
    <div
      class="flex-grow-1 overflow-y-auto data-scroll-container custom-scrollbar"
    >
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="table-grid-row data-row py-1 text-white"
      >
        <!-- Checkbox cell -->
        <div class="grid-cell d-flex justify-center align-center">
          <v-checkbox-btn
            :model-value="isItemSelected(item)"
            color="white"
            @update:model-value="toggleItem(item)"
          />
        </div>

        <!-- Name cell -->
        <div class="grid-cell d-flex align-center overflow-hidden">
          <v-icon size="20" class="mr-3 opacity-60 flex-shrink-0"
            >mdi-file-outline</v-icon
          >
          <span
            class="font-weight-medium cursor-pointer text-truncate"
            @click="emit('rename', item)"
          >
            {{ item.name }}
          </span>
        </div>

        <!-- Type cell -->
        <div class="grid-cell d-flex justify-center align-center">
          <v-chip
            size="x-small"
            color="white"
            variant="outlined"
            class="text-none border-opacity-20 font-weight-bold"
          >
            {{ item.geode_object_type }}
          </v-chip>
        </div>

        <!-- Date cell -->
        <div class="grid-cell d-flex justify-center align-center">
          <span
            class="text-caption text-grey-lighten-2 font-weight-light text-center"
          >
            {{ formatSmartDate(item.created_at) }}
          </span>
        </div>

        <!-- Visibility cell -->
        <div class="grid-cell d-flex justify-center align-center">
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click.stop="emit('toggle-visibility', item)"
          >
            <v-icon size="20">{{
              item.visible ? "mdi-eye" : "mdi-eye-off"
            }}</v-icon>
          </v-btn>
        </div>

        <!-- Actions cell -->
        <div class="grid-cell d-flex ga-1 justify-end align-center pr-2">
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click.stop="emit('focus-camera', item)"
          >
            <v-icon size="18">mdi-target</v-icon>
            <v-tooltip activator="parent" location="top">Focus</v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click.stop="emit('isolate', item)"
          >
            <v-icon size="18">mdi-filter-variant</v-icon>
            <v-tooltip activator="parent" location="top">Isolate</v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click.stop="emit('rename', item)"
          >
            <v-icon size="18">mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top">Rename</v-tooltip>
          </v-btn>

          <v-btn
            icon
            size="small"
            variant="text"
            color="error"
            @click.stop="emit('delete', item)"
          >
            <v-icon size="18">mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Delete</v-tooltip>
          </v-btn>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredItems.length === 0"
        class="d-flex justify-center align-center py-12 text-grey-lighten-1"
      >
        No data found
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Unified Grid System for perfect alignment */
  .table-grid-row {
    display: grid;
    /* [Select] [Name] [Type] [Date] [Vis] [Actions] */
    grid-template-columns: 48px 1fr 80px 160px 100px 160px;
    align-items: center;
    width: 100%;
  }

  .grid-cell {
    min-width: 0;
  }

  .header-label {
    font-size: 0.7rem !important;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    padding: 0 8px;
  }

  .custom-table-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .data-scroll-container {
    /* Create the "disappearing" effect at the top boundary */
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      black 15px,
      black 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0,
      black 15px,
      black 100%
    );
  }

  .data-row {
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    transition: background-color 0.15s ease;
  }

  .data-row:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
</style>
