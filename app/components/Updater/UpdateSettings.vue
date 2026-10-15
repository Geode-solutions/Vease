<script setup lang="ts">
import { type UpdateChannel, useUpdaterStore } from "@vease/stores/updater";

const updaterStore = useUpdaterStore();

const STATUS_LABELS: Record<string, string> = {
  idle: "Not checked yet",
  checking: "Checking for updates…",
  available: "Update available",
  "not-available": "Vease is up to date",
  downloading: "Downloading update…",
  downloaded: "Update downloaded, restart to install",
  error: "Update failed",
  unsupported: "Updates unavailable",
};

// Empty string stands for "no pinned version" in the select
const NO_PIN = "";

const versionItems = computed(() => [
  { title: "Follow channel (no pin)", value: NO_PIN },
  ...updaterStore.versions.map((version) => ({ title: `v${version}`, value: version })),
]);

const statusLabel = computed(() => {
  const { state, message } = updaterStore.status;
  const label = STATUS_LABELS[state] ?? state;
  return message ? `${label}: ${message}` : label;
});

const busy = computed(() => ["checking", "downloading"].includes(updaterStore.status.state));
const unsupported = computed(() => updaterStore.status.state === "unsupported");

function onChannelChange(channel: UpdateChannel): void {
  void updaterStore.setChannel(channel);
}

function onPinChange(version: string): void {
  void updaterStore.pin(version === NO_PIN ? undefined : version);
}

onMounted(async () => {
  await updaterStore.init();
  await updaterStore.loadVersions();
});
</script>

<template>
  <v-row class="pa-3" data-testid="updateSettings">
    <v-col cols="12">
      <p class="text-h4 text-white">Updates</p>
      <v-divider />
      <v-row class="pa-3">
        <v-col cols="12" class="d-flex align-center flex-wrap ga-4">
          <v-btn-toggle
            :model-value="updaterStore.channel"
            mandatory
            density="compact"
            variant="outlined"
            :disabled="unsupported || updaterStore.pinnedVersion !== undefined"
            data-testid="updateChannelToggle"
            @update:model-value="onChannelChange"
          >
            <v-btn value="master">Stable</v-btn>
            <v-btn value="next">Preview</v-btn>
          </v-btn-toggle>
          <v-select
            :model-value="updaterStore.pinnedVersion ?? NO_PIN"
            :items="versionItems"
            label="Pinned version"
            density="compact"
            hide-details
            max-width="260"
            :disabled="unsupported"
            data-testid="updatePinSelect"
            @update:model-value="onPinChange"
          />
          <v-btn
            :loading="busy"
            :disabled="unsupported"
            prepend-icon="mdi-refresh"
            data-testid="updateCheckButton"
            @click="updaterStore.check()"
          >
            Check now
          </v-btn>
        </v-col>
        <v-col cols="12" class="pt-0">
          <p class="text-white mb-0" data-testid="updateStatus">{{ statusLabel }}</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
