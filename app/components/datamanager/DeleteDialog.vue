<template>
  <v-dialog
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    max-width="400"
    persistent
  >
    <v-card
      v-if="item"
      rounded="xl"
      class="bg-white text-center overflow-hidden"
    >
      <div class="bg-error w-100" style="height: 6px"></div>
      <v-avatar color="red-lighten-5" size="64" class="mt-8 mx-auto"
        ><v-icon color="error" size="32"
          >mdi-trash-can-outline</v-icon
        ></v-avatar
      >
      <v-card-title class="text-h5 font-weight-bold text-grey-darken-4 pt-4"
        >Delete Item</v-card-title
      >
      <v-card-text class="text-grey-darken-1 px-8">
        Are you sure you want to delete this item?
        <div
          class="bg-grey-lighten-4 rounded-lg pa-3 my-4 text-grey-darken-3 font-weight-bold border"
        >
          {{ item.name }}
        </div>
      </v-card-text>
      <v-card-actions class="px-8 pb-8"
        ><v-spacer /><v-btn variant="text" @click="$emit('update:show', false)"
          >Cancel</v-btn
        >
        <v-btn
          color="error"
          variant="flat"
          class="px-8 rounded-pill"
          @click="$emit('confirm')"
          >Delete</v-btn
        ></v-card-actions
      >
    </v-card>

    <v-card v-else rounded="xl" class="bg-white text-center overflow-hidden">
      <div class="bg-error w-100" style="height: 6px"></div>
      <v-avatar color="red-lighten-5" size="64" class="mt-8 mx-auto"
        ><v-icon color="error" size="32"
          >mdi-alert-circle-outline</v-icon
        ></v-avatar
      >
      <v-card-title class="text-h5 font-weight-bold text-grey-darken-4 pt-4"
        >Delete Items</v-card-title
      >
      <v-card-text class="text-grey-darken-1 px-8">
        Are you sure you want to delete
        <strong>{{ selectedCount }}</strong> items?
      </v-card-text>
      <v-card-actions class="px-8 pb-8"
        ><v-spacer /><v-btn variant="text" @click="$emit('update:show', false)"
          >Cancel</v-btn
        >
        <v-btn
          color="error"
          variant="flat"
          class="px-8 rounded-pill"
          @click="$emit('confirm')"
          >Delete All</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>

<script setup>
  defineProps({
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

  defineEmits(["update:show", "confirm"])
</script>
