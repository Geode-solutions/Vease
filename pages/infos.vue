<template>
  <v-row class="fill-height pa-5">
    <v-col cols="12">
      <v-card style="height: 100%; width: 100%; overflow-y: auto;" class="bg-primary">
        <v-container>
          <v-row class="pa-3">
            <v-col cols="12" md="6">
              <p class="text-h4 text-white">App version</p>
              <v-divider />
              <v-row class="pa-5">
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
            </v-col>
          </v-row>
          <v-row class="pa-3">
            <v-col cols="12" md="6">
              <p class="text-h4 text-white">Internal dependencies</p>
              <v-divider />
              <v-row class="pa-5">
                <p class="text-white"> The app uses the following internal dependencies :</p>
              </v-row>

              <v-table
                class="pa-2"
                style="background-color: transparent"
                width="50%"
              >
                <thead>
                  <tr>
                    <th class="text-left text-white" width="30%">Package</th>
                    <th class="text-left text-white" width="50%">Version</th>
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
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import vease_back_schemas from "@geode/vease-back/schemas.json";
console.log(vease_back_schemas);
const version = useRuntimeConfig().public.VERSION;

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
