<template>
  <v-card
    style="height: 100%; width: 100%; overflow-y: auto; border-radius: 10px"
    class="bg-primary"
  >
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
                      'https://github.com/Geode-solutions/Vease/releases/tag/v' +
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
            <v-table
              class="pa-3"
              density="compact"
              style="background-color: transparent"
            >
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
                      :href="
                        'https://pypi.org/project/' +
                        pkg.package +
                        '/' +
                        pkg.version +
                        '/'
                      "
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
                Copyright © 2019 - {{ new Date().getFullYear() }} —
                Geode-solutions SAS. All rights reserved.
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
                      <v-icon
                        :icon="
                          microservice.status
                            ? 'mdi-check-circle'
                            : 'mdi-close-circle'
                        "
                        :color="microservice.status ? 'white' : 'red'"
                        v-tooltip:right="
                          microservice.status
                            ? 'Microservice is running'
                            : 'Microservice is not running'
                        "
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-row>
          </v-row>
          <v-row class="pa-3">
            <v-col cols="12">
              <v-btn
                href="https://github.com/Geode-solutions/Vease/issues/new"
                target="_blank"
                >Report an issue</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import vease_back_schemas from "@geode/vease-back/schemas.json";
import vease_viewer_schemas from "@geode/vease-viewer/schemas.json";

const version = useRuntimeConfig().public.VERSION;
const geode_store = use_geode_store();
const viewer_store = use_viewer_store();

const packages_versions = ref([]);
const back_version = ref("");
const viewer_version = ref("");

const microservices = ref([
  {
    name: "Back",
    package: "vease-back",
    version: back_version,
    status: geode_store.is_running,
  },
  {
    name: "Viewer",
    package: "vease-viewer",
    version: viewer_version,
    status: viewer_store.is_running,
  },
]);

async function get_packages_versions() {
  api_fetch(
    { schema: vease_back_schemas.vease_back.packages_versions },
    {
      response_function: (response) => {
        packages_versions.value = response._data.packages_versions;
      },
    }
  );
}

async function get_back_version() {
  api_fetch(
    { schema: vease_back_schemas.vease_back.microservice_version },
    {
      response_function: (response) => {
        back_version.value = response._data.microservice_version;
      },
    }
  );
}

async function get_viewer_version() {
  viewer_call(
    { schema: vease_viewer_schemas.vease_viewer.microservice_version },
    {
      response_function: (response) => {
        viewer_version.value = response.microservice_version;
      },
    }
  );
}

onMounted(() => {
  get_packages_versions();
  get_back_version();
  get_viewer_version();
});
</script>

<style scoped>
td {
  text-align: left;
}

</style>
