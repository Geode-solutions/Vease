<script setup lang="ts">
import {
  type ColumnRow,
  horizonStackInfo,
  stratigraphicColumn,
} from "@vease/utils/controller/handlers/horizon_stack";
import GlassCard from "@ogw_front/components/GlassCard.vue";
import { consola } from "consola";
import { useEventListener } from "@vueuse/core";

interface TreeItem {
  id?: string;
  name?: string;
  title?: string;
}

const isOpen = ref(false);
const loading = ref(false);
const item = ref<TreeItem>({});
const column = ref<ColumnRow[] | undefined>(undefined);

const itemName = computed(() => item.value.title || item.value.name || item.value.id || "");

async function onOpen(event: Event): Promise<void> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- the object tree dispatches its raw item
  item.value = (event as CustomEvent<TreeItem>).detail ?? {};
  column.value = undefined;
  isOpen.value = true;
  if (!item.value.id) {
    return;
  }
  loading.value = true;
  try {
    column.value = stratigraphicColumn(await horizonStackInfo({ id: item.value.id }));
  } catch (error) {
    consola.error("[HorizonStackDialog] Failed to read the horizon stack", error);
  } finally {
    loading.value = false;
  }
}

function handleClose(): void {
  isOpen.value = false;
}

useEventListener(globalThis, "open-horizon-stack-modal", onOpen);
</script>

<template>
  <v-dialog v-model="isOpen" max-width="600">
    <GlassCard variant="panel" padding="pa-0" :escapeFunction="handleClose">
      <v-card-title class="d-flex align-center bg-primary text-white py-3 px-4">
        <v-icon icon="mdi-layers-triple" class="mr-2" />
        <span class="text-subtitle-1 font-weight-bold">Horizon Stack</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="handleClose" />
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="text-h6 text-white mb-4" data-testid="horizonStackDialogName">
          {{ itemName }}
        </div>
        <div v-if="loading" class="d-flex justify-center pa-4">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <template v-else-if="column">
          <div class="text-caption font-weight-bold text-white opacity-70 mb-2">
            Stratigraphic column (top to bottom)
          </div>
          <v-list density="compact" class="bg-transparent pa-0" data-testid="horizonStackColumn">
            <template v-for="row in column" :key="row.id">
              <v-list-item
                v-if="row.kind === 'horizon'"
                class="px-2 min-h-0 rounded-sm border-s-sm border-primary horizon-row"
              >
                <v-list-item-title class="text-caption font-weight-medium text-primary">
                  {{ row.name }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-else class="px-2 min-h-0 text-caption text-white opacity-70">
                {{ row.name }}
              </v-list-item>
            </template>
          </v-list>
        </template>
        <v-alert v-else type="error" variant="tonal" density="compact">
          The horizon stack could not be read.
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="white" variant="text" @click="handleClose">Close</v-btn>
      </v-card-actions>
    </GlassCard>
  </v-dialog>
</template>

<style scoped>
.min-h-0 {
  min-height: 0 !important;
}
.horizon-row {
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
