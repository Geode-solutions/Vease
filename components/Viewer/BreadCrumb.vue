<template>
  <v-breadcrumbs :items="items" class="pa-0">
    <template v-slot:item="{ item, index }">
      <v-icon
        :class="{ 'grey--text text--darken-1': index !== items.length - 1 }"
        @click="emit('click', item.value)"
      >
        {{ item.icon }}
      </v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "click"]);

const items = ref([]);

function updateItems() {
  items.value = props.modelValue.map((item) => ({
    value: item,
    icon: item.icon,
    disabled: false,
  }));
}

watch(() => props.modelValue, updateItems, { immediate: true });
</script>
