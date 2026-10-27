<script setup lang="ts">
import { getBackStore, getInfraStore } from "@vease/utils/external_stores";
import { Status } from "@ogw_front/utils/status";
import UpdateSettings from "@vease/components/Updater/UpdateSettings.vue";
import { isUpdaterAvailable } from "@vease/stores/updater";
import { runFunctionWhenMicroservicesConnected } from "@ogw_front/composables/run_function_when_microservices_connected";
import { useAppStore } from "@ogw_front/stores/app";
import { useClipboard } from "@vueuse/core";
import { useViewerStore } from "@ogw_front/stores/viewer";
import vease_back_schemas from "@geode/vease-back/vease_back_typed_schemas.js";
import vease_viewer_schemas from "@geode/vease-viewer/vease_viewer_typed_schemas.js";

interface PackageVersion {
  package: string;
  version: string;
}

const version = useRuntimeConfig().public.VERSION;
const appStore = useAppStore();
const updaterAvailable = isUpdaterAvailable();
const backStore = getBackStore();
const viewerStore = useViewerStore();

const back_version = ref("");
const viewer_version = ref("");

const infraStore = getInfraStore();
const packages_versions = ref<PackageVersion[]>([]);

const { copy, copied } = useClipboard({ copiedDuring: 1500 });
function copy_url(): void {
  copy(appStore.base_url);
}

const microservices = computed(() =>
  infraStore.microservices.map((store) => ({
    name: store.$id.charAt(0).toUpperCase() + store.$id.slice(1),
    package: `vease-${store.$id}`,
    version: store.version,
    status: store.status,
  })),
);

function get_packages_versions(): void {
  const schema = vease_back_schemas.vease_back.packages_versions;
  backStore.request(
    { schema },
    {
      response_function: (response) => {
        packages_versions.value = response.packages_versions;
      },
    },
  );
}

runFunctionWhenMicroservicesConnected(() => {
  get_packages_versions();
  for (const store of infraStore.microservices) {
    if (store.$id === "back") {
      store.get_version?.(vease_back_schemas.vease_back.microservice_version);
    } else if (store.$id === "viewer") {
      store.get_version?.(vease_viewer_schemas.vease_viewer.microservice_version);
    } else if (typeof store.get_version === "function") {
      store.get_version();
    }
  }
});
</script>

<template>
  <v-card flat color="transparent" class="d-flex flex-column fill-height" theme="dark">
    <div class="px-6 pt-6 pb-2">
      <div class="d-flex align-center mb-4">
        <v-icon icon="mdi-information-outline" class="mr-3 text-white" size="32" />
        <h2 class="text-h4 font-weight-bold text-white">Infos</h2>
      </div>
    </div>

    <div class="flex-grow-1 overflow-y-auto px-6 pb-6 infos-content">
      <v-row>
        <v-col cols="12" md="6" class="d-flex flex-column ga-4">
          <v-card color="white" variant="tonal" rounded="lg">
            <v-card-title class="d-flex align-center text-white">
              <v-icon icon="mdi-application-outline" size="20" class="mr-2" />App</v-card-title
            >
            <v-card-text class="text-white">
              <p class="mb-2">
                Version:
                <a
                  :href="
                    'https://github.com/Geode-solutions/Vease/releases/' +
                    (version !== 'latest' ? 'tag/v' : '') +
                    version
                  "
                  target="_blank"
                  rel="noopener"
                  class="text-white text-no-wrap"
                  >{{ version }}<v-icon icon="mdi-open-in-new" size="x-small" class="ml-1"
                /></a>
              </p>
              <div class="d-flex align-center">
                <span class="text-truncate">URL: {{ appStore.base_url }}</span>
                <v-tooltip :text="copied ? 'Copied!' : 'Copy URL'" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                      aria-label="Copy URL"
                      size="small"
                      variant="text"
                      density="comfortable"
                      class="ml-1"
                      @click="copy_url"
                    />
                  </template>
                </v-tooltip>
              </div>
            </v-card-text>
          </v-card>

          <UpdateSettings v-if="updaterAvailable" />

          <v-card color="white" variant="tonal" rounded="lg">
            <v-card-title class="d-flex align-center text-white">
              <v-icon icon="mdi-lifebuoy" size="20" class="mr-2" />Support</v-card-title
            >
            <v-card-text class="text-white">
              <p class="mb-4">
                Vease is an open-source project.
                <br />
                Copyright © 2019 - {{ new Date().getFullYear() }} — Geode-solutions SAS. All rights
                reserved.
              </p>
              <v-btn
                href="https://github.com/Geode-solutions/Vease/issues/new"
                target="_blank"
                rel="noopener"
                prepend-icon="mdi-github"
                append-icon="mdi-open-in-new"
                >Report an issue</v-btn
              >
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" class="d-flex flex-column ga-4">
          <v-card color="white" variant="tonal" rounded="lg">
            <v-card-title class="d-flex align-center text-white">
              <v-icon icon="mdi-server-network" size="20" class="mr-2" />Microservices</v-card-title
            >
            <v-table density="compact" class="bg-transparent text-white">
              <thead>
                <tr>
                  <th class="text-white">Name</th>
                  <th class="text-white">Version</th>
                  <th class="text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="microservice in microservices" :key="microservice.name">
                  <td>{{ microservice.name }}</td>
                  <td>
                    <a
                      :href="`https://pypi.org/project/${microservice.package}/${microservice.version}/`"
                      target="_blank"
                      rel="noopener"
                      class="text-white text-no-wrap"
                      >{{ microservice.version
                      }}<v-icon icon="mdi-open-in-new" size="x-small" class="ml-1"
                    /></a>
                  </td>
                  <td>
                    <v-tooltip :text="`Microservice is ${microservice.status}`" location="right">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          v-if="microservice.status == Status.NOT_CONNECTED"
                          v-bind="props"
                          icon="mdi-close-circle"
                          color="red"
                        />
                        <v-progress-circular
                          v-else-if="microservice.status == Status.CONNECTING"
                          v-bind="props"
                          indeterminate
                          size="20"
                          width="2"
                        />
                        <v-icon
                          v-else-if="microservice.status == Status.CONNECTED"
                          v-bind="props"
                          icon="mdi-check-circle"
                          color="white"
                        />
                      </template>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <v-card color="white" variant="tonal" rounded="lg">
            <v-card-title class="d-flex align-center text-white">
              <v-icon icon="mdi-package-variant-closed" size="20" class="mr-2" />Internal
              dependencies</v-card-title
            >
            <v-table density="compact" class="bg-transparent text-white">
              <thead>
                <tr>
                  <th class="text-white">Package</th>
                  <th class="text-white">Version</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pkg in packages_versions" :key="pkg.package">
                  <td>{{ pkg.package }}</td>
                  <td>
                    <a
                      :href="'https://pypi.org/project/' + pkg.package + '/' + pkg.version + '/'"
                      target="_blank"
                      rel="noopener"
                      class="text-white text-no-wrap"
                      >{{ pkg.version }}<v-icon icon="mdi-open-in-new" size="x-small" class="ml-1"
                    /></a>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped>
.infos-content {
  min-height: 0;
}
td,
th {
  text-align: left;
}
</style>
