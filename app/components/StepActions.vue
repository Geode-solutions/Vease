<script setup lang="ts">
import type { Ref } from "vue";
import { consola } from "consola";
import { useUIStore } from "@vease/stores/ui";

// Last step of an import stepper: runs the action, then resets and closes the stepper either way.
const emit = defineEmits<{ reset_values: [] }>();

const { label, icon, testId, action } = defineProps<{
  label: string;
  icon: string;
  testId: string;
  action: () => Promise<unknown>;
}>();

const UIStore = useUIStore();

const confirm_button = useTemplateRef("confirm_button");
// VueUse's useFocus supports component refs at runtime (it reads `.$el`), but
// Vuetify's generated component instance type is too complex for its own
// MaybeElementRef declaration to structurally match.
useFocus(confirm_button as unknown as Ref<HTMLElement | null>, { initialValue: true });

const loading = ref(false);
const toggle_loading = useToggle(loading);

function close(): void {
  emit("reset_values");
  UIStore.setShowStepper(false);
}

async function confirm(): Promise<void> {
  toggle_loading();
  try {
    await action();
  } catch (error) {
    consola.error(`${label} failed:`, error);
  } finally {
    close();
    toggle_loading();
  }
}
</script>

<template>
  <v-card-actions class="mt-4">
    <v-btn
      ref="confirm_button"
      :data-testid="testId"
      :loading="loading"
      color="primary"
      variant="elevated"
      size="large"
      rounded="lg"
      class="text-none px-8 font-weight-bold"
      @click="confirm"
    >
      <v-icon start size="20">{{ icon }}</v-icon>
      {{ label }}
    </v-btn>
    <v-btn
      color="error"
      variant="text"
      size="large"
      class="text-none ml-2 font-weight-bold"
      @click="close"
    >
      Cancel
    </v-btn>
  </v-card-actions>
</template>
