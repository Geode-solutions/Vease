<script setup>
  const { show, item, selectedCount } = defineProps({
    show: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    selectedCount: {
      type: Number,
      default: 0,
    },
  })

  const emit = defineEmits(["update:show", "confirm"])
</script>

<template>
  <v-dialog
    :model-value="show"
    @update:model-value="emit('update:show', $event)"
    max-width="400"
  >
    <GlassCard v-if="item" variant="panel" padding="pa-8">
      <v-card-title
        class="pb-2 text-h5 font-weight-bold d-flex align-center text-white"
      >
        <v-icon
          icon="mdi-trash-can-outline"
          class="mr-3 text-h4"
          color="error"
        ></v-icon>
        Delete Item
      </v-card-title>

      <v-card-text class="pa-0 mt-4 text-white opacity-80">
        Are you sure you want to delete this item?
        <div
          class="bg-white-opacity-5 rounded-lg pa-4 my-6 font-weight-bold border-thin text-center"
        >
          {{ item.name }}
        </div>
      </v-card-text>

      <v-card-actions class="px-0 pb-0">
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
          color="error"
          size="large"
          variant="flat"
          @click="emit('confirm')"
          class="text-none rounded-lg font-weight-bold"
          elevation="4"
        >
          <v-icon start>mdi-trash-can-outline</v-icon>
          Delete
        </v-btn>
      </v-card-actions>
    </GlassCard>

    <GlassCard v-else variant="panel" padding="pa-8">
      <v-card-title
        class="pb-2 text-h5 font-weight-bold d-flex align-center text-white"
      >
        <v-icon
          icon="mdi-alert-circle-outline"
          class="mr-3 text-h4"
          color="error"
        ></v-icon>
        Delete Items
      </v-card-title>

      <v-card-text class="pa-0 mt-4 text-white opacity-80">
        Are you sure you want to delete
        <strong class="text-white">{{ selectedCount }}</strong> items?
      </v-card-text>

      <v-card-actions class="px-0 pb-0 mt-8">
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
          color="error"
          size="large"
          variant="flat"
          @click="emit('confirm')"
          class="text-none rounded-lg font-weight-bold"
          elevation="4"
        >
          <v-icon start>mdi-trash-can-outline</v-icon>
          Delete All
        </v-btn>
      </v-card-actions>
    </GlassCard>
  </v-dialog>
</template>
