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
  <v-row class="fill-height ma-0 pt-4">
    <v-col
      cols="12"
      md="4"
      lg="3"
      class="pl-0 py-0 pr-4 d-flex flex-column fill-height"
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
      class="pr-0 py-0 pl-2 d-flex flex-column fill-height"
    >
      <MarketplaceDetails :extension="selectedExtension" />
    </v-col>
  </v-row>
</template>
