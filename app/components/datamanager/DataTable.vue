<script setup>
  const SECONDS_IN_MINUTE = 60
  const SECONDS_IN_HOUR = 3600
  const SECONDS_IN_DAY = 86400
  const MILLISECONDS_TO_SECONDS = 1000

  const { items, search } = defineProps({
    items: { type: Array, required: true },
    search: { type: String, default: "" },
  })

  const selectedIds = defineModel("selectedIds", {
    type: Array,
    default: () => [],
  })

  defineEmits([
    "toggle-visibility",
    "focus-camera",
    "isolate",
    "rename",
    "delete",
  ])

  const headers = [
    { title: "Name", key: "name", sortable: true },
    {
      title: "Type",
      key: "geode_object_type",
      sortable: true,
      align: "center",
    },
    { title: "Date", key: "created_at", sortable: true, align: "center" },
    { title: "Visibility", key: "visible", sortable: false, align: "center" },
    { title: "Actions", key: "actions", sortable: false, align: "end" },
  ]

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
  <v-data-table
    v-model="selectedIds"
    :headers="headers"
    :items="items"
    :search="search"
    show-select
    item-value="id"
    class="bg-transparent"
    hide-default-footer
    :items-per-page="-1"
  >
    <template #[`item.name`]="{ item }">
      <div class="d-flex align-center ga-2">
        <span class="text-body-2 font-weight-medium text-white">{{
          item.name || "Unnamed Object"
        }}</span>
      </div>
    </template>

    <template #[`item.geode_object_type`]="{ item }">
      <v-chip size="x-small" color="primary" variant="tonal" class="text-none">
        {{ item.geode_object_type }}
      </v-chip>
    </template>

    <template #[`item.created_at`]="{ item }">
      <span class="text-caption text-grey-lighten-1">{{
        formatSmartDate(item.created_at)
      }}</span>
    </template>

    <template #[`item.visible`]="{ item }">
      <v-btn
        :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'"
        size="x-small"
        variant="text"
        :color="item.visible ? 'primary' : 'grey-lighten-1'"
        @click="$emit('toggle-visibility', item)"
      />
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="d-flex ga-1 justify-end">
        <v-btn
          icon="mdi-crosshairs-gps"
          size="x-small"
          variant="text"
          color="white"
          @click="$emit('focus-camera', item)"
        />
        <v-btn
          icon="mdi-filter"
          size="x-small"
          variant="text"
          color="white"
          @click="$emit('isolate', item)"
        />
        <v-btn
          icon="mdi-pencil"
          size="x-small"
          variant="text"
          color="white"
          @click="$emit('rename', item)"
        />
        <v-btn
          icon="mdi-delete"
          size="x-small"
          variant="text"
          color="error"
          @click="$emit('delete', item)"
        />
      </div>
    </template>
  </v-data-table>
</template>
