<template>
  <v-card
    style="height: 100%; width: 100%; overflow-y: auto; border-radius: 10px"
    class="bg-primary"
  >
    <v-container>
      <v-row class="pa-1">
        <v-col cols="6" md="6">
          <v-row class="pa-5">
            <p class="text-h4 text-white">App version</p>
            <v-divider />
            <p class="text-white">The current version of the app is&nbsp</p>
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
          </v-row>
          <v-row class="pa-5">
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
          <v-row class="pa-5">
            <v-btn
              href="https://github.com/Geode-solutions/Vease/issues/new"
              target="_blank"
              >Report an issue</v-btn
            >
          </v-row>
          <v-row class="pa-5">
            <p class="text-white">
              Vease is an open-source project.
              <br />
              Copyright © 2019 - {{ new Date().getFullYear() }} —
              Geode-solutions SAS. All rights reserved.
            </p>
          </v-row>
        </v-col>
        <v-divider vertical/>
        <v-col cols="6">
          <v-row class="pa-5">
            <p class="text-h4 text-white">Microservices status</p>
            <v-divider />
            <v-row class="pa-5">
              <v-table
                class="pa-2"
                density="compact"
                style="background-color: transparent"
                width="50%"
              >
                <tbody>
                  <tr>
                    <td class="text-left text-white">Back</td>
                    <td>
                      <v-icon
                        :icon="
                          geode_store.is_running
                            ? 'mdi-check-circle'
                            : 'mdi-close-circle'
                        "
                        :color="geode_store.is_running ? 'white' : 'red'"
                        v-tooltip:right="
                          geode_store.is_running
                            ? 'Microservice is running'
                            : 'Microservice is not running'
                        "
                      />
                    </td>
                  </tr>

                  <tr>
                    <td class="text-left text-white">Viewer</td>
                    <td>
                      <v-icon
                        :icon="
                          viewer_store.is_running
                            ? 'mdi-check-circle'
                            : 'mdi-close-circle'
                        "
                        :color="viewer_store.is_running ? 'white' : 'red'"
                        v-tooltip:right="
                          viewer_store.is_running
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
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import vease_back_schemas from "@geode/vease-back/schemas.json";

const version = useRuntimeConfig().public.VERSION;
const geode_store = use_geode_store();
const viewer_store = use_viewer_store();

const packages_versions = ref([]);

async function get_packages_versions() {
  api_fetch(
    { schema: vease_back_schemas.routes.versions },
    {
      response_function: (response) => {
        packages_versions.value = response._data.versions;
      },
    }
  );
}

onMounted(() => {
  get_packages_versions();
});
</script>
