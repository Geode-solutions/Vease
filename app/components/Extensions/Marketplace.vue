<script setup>
import GlassCard from "@ogw_front/components/GlassCard";
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
  <v-row v-if="user" class="responsive-height-row ma-0 pt-4">
    <v-col
      cols="12"
      md="4"
      lg="3"
      class="d-flex flex-column pa-0 pr-md-4 pb-4 pb-md-0"
      style="min-height: 0"
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
      style="min-height: 0"
    >
      <MarketplaceDetails :extension="selectedExtension" />
    </v-col>
  </v-row>

  <v-row
    v-else
    class="responsive-height-row ma-0 pt-4 align-center justify-center"
  >
    <v-col cols="12" sm="8" md="6" lg="5" class="d-flex justify-center">
      <GlassCard
        variant="ui"
        padding="pa-8"
        class="d-flex flex-column align-center text-center border-white border-opacity-10 w-100"
      >
        <v-sheet
          class="mx-auto mb-6 d-flex align-center justify-center"
          rounded="circle"
          color="rgba(255,255,255,0.05)"
          width="96"
          height="96"
        >
          <v-icon
            icon="mdi-lock-outline"
            size="48"
            color="white"
            class="opacity-80"
          ></v-icon>
        </v-sheet>

        <h2 class="text-h5 font-weight-bold text-white mb-3">
          Authentication Required
        </h2>

        <p class="text-body-1 text-white opacity-80 mb-8">
          You must be logged in to access the marketplace, browse available
          extensions, and install them on your project.
        </p>

        <v-btn
          color="white"
          variant="elevated"
          prepend-icon="mdi-login"
          elevation="4"
          rounded="pill"
          class="text-none px-8 font-weight-bold text-black"
          to="/login"
        >
          Sign In
        </v-btn>
      </GlassCard>
    </v-col>
  </v-row>
</template>

<style scoped>
.responsive-height-row {
  min-height: 0;
}

@media (min-width: 960px) {
  .responsive-height-row {
    height: 100%;
  }
}
</style>
