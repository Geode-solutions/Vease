<script setup>
import MarketplaceDetails from "./MarketplaceDetails.vue";
import MarketplaceSidebar from "./MarketplaceSidebar.vue";
import { useAuth } from "@vease/composables/auth";
import { useExtensions } from "@vease/composables/extensions";

const { allowedExtensions } = useExtensions();
const { user } = useAuth();

const {
  data: extensions,
  pending,
  error: fetchError,
} = await useAsyncData("extensions", () => allowedExtensions(), {
  watch: [user],
});

const selectedExtension = ref(undefined);
</script>

<template>
  <v-row class="responsive-height-row ma-0 pt-4">
    <v-col
      cols="12"
      md="4"
      lg="3"
      class="d-flex flex-column pa-0 pr-md-4 pb-4 pb-md-0"
      style="min-height: 0;"
    >
      <MarketplaceSidebar
        v-model="selectedExtension"
        :extensions="extensions || []"
        :pending="pending"
        :fetch-error="fetchError"
      />
    </v-col>

    <v-col
      cols="12"
      md="8"
      lg="9"
      class="d-flex flex-column pa-0 pl-md-2"
      style="min-height: 0;"
    >
      <MarketplaceDetails :extension="selectedExtension" />
    </v-col>
  </v-row>
</template>

<style scoped>
.responsive-height-row {
  min-height: 0;
}

/* On desktop (md and up), the row takes exactly 100% height to enable inner scrolling */
@media (min-width: 960px) {
  .responsive-height-row {
    height: 100%;
  }
}
</style>
