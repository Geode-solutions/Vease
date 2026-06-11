<script setup>
import { Status } from "@ogw_front/utils/status";
import vease_back_schemas from "@geode/vease-back/vease_back_schemas.json";
import vease_viewer_schemas from "@geode/vease-viewer/vease_viewer_schemas.json";

import { runFunctionWhenMicroservicesConnected } from "@ogw_front/composables/runFunctionWhenMicroservicesConnected";
import { useBackStore } from "@ogw_front/stores/back";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useViewerStore } from "@ogw_front/stores/viewer";

const version = useRuntimeConfig().public.VERSION;
const backStore = useBackStore();
const viewerStore = useViewerStore();

const back_version = ref("");
const viewer_version = ref("");

const infraStore = useInfraStore();
const packages_versions = ref([]);

const microservices = computed(() =>
  infraStore.microservices.map((store) => {
    let pkg = "opengeodeweb-back";
    if (store.$id === "viewer") {
      pkg = "opengeodeweb-viewer";
    }
    return {
      name: store.$id.charAt(0).toUpperCase() + store.$id.slice(1),
      package: `vease-${store.$id}`,
      version: store.version,
      status: store.status,
    };
  }),
);

function get_packages_versions() {
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
      store.get_version(vease_back_schemas.vease_back.microservice_version);
    } else if (store.$id === "viewer") {
      store.get_version(vease_viewer_schemas.vease_viewer.microservice_version);
    } else if (typeof store.get_version === "function") {
      store.get_version();
    }
  }
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-row class="pa-3">
          <p class="text-h4 text-white">App version</p>
          <v-divider />
          <v-row class="pa-3">
            <v-col cols="12">
              <p class="text-white text-no-wrap">
                The current version of the app is
                <a
                  :href="
                    'https://github.com/Geode-solutions/Vease/releases/' +
                    (version !== 'latest' ? 'tag/v' : '') +
                    version
                  "
                  target="_blank"
                  class="text-left text-white"
                >
                  {{ version }}</a
                >
              </p>
            </v-col>
          </v-row>
        </v-row>
        <v-row class="pa-3">
          <p class="text-h4 text-white">Internal dependencies</p>
          <v-divider />
          <v-table class="pa-3" density="compact" style="background-color: transparent">
            <thead>
              <tr>
                <th class="text-left text-white" width="400px">Package</th>
                <th class="text-left text-white">Version</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pkg in packages_versions" :key="pkg">
                <td class="text-left text-white">{{ pkg.package }}</td>
                <td>
                  <a
                    :href="'https://pypi.org/project/' + pkg.package + '/' + pkg.version + '/'"
                    target="_blank"
                    class="text-left text-white"
                    >{{ pkg.version }}</a
                  >
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-row>
        <v-row class="pa-3">
          <v-col cols="12">
            <p class="text-white">
              Vease is an open-source project.
              <br />
              Copyright © 2019 - {{ new Date().getFullYear() }} — Geode-solutions SAS. All rights
              reserved.
            </p>
          </v-col>
        </v-row>
      </v-col>
      <v-divider vertical />
      <v-col cols="6">
        <v-row class="pa-3">
          <p class="text-h4 text-white">Microservices</p>
          <v-divider />
          <v-row class="pa-3">
            <v-table
              class="pa-2"
              density="compact"
              style="background-color: transparent"
              width="50%"
            >
              <thead>
                <tr>
                  <th class="text-left text-white"></th>
                  <th class="text-left text-white">Version</th>
                  <th class="text-left text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="microservice in microservices" :key="microservice">
                  <td class="text-left text-white">
                    {{ microservice.name }}
                  </td>
                  <td>
                    <a
                      :href="`https://pypi.org/project/${microservice.package}/${microservice.version}/`"
                      target="_blank"
                      class="text-left text-white"
                      >{{ microservice.version }}
                    </a>
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
                          color="primary"
                        />
                        <v-icon
                          v-if="microservice.status == Status.CONNECTED"
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
          </v-row>
        </v-row>
        <v-row class="pa-3">
          <v-col cols="12">
            <v-btn href="https://github.com/Geode-solutions/Vease/issues/new" target="_blank"
              >Report an issue</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
td {
  text-align: left;
}
</style>
