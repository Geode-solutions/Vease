<script setup lang="ts">
import FeedBackSnackers from "@ogw_front/components/FeedBack/Snackers.vue";

import GlobalComponents from "@vease/components/Extensions/GlobalComponents.vue";
import HorizonStackDialog from "@vease/components/HorizonStackDialog.vue";
import UpdateSnackbar from "@vease/components/Updater/UpdateSnackbar.vue";
import { isUpdaterAvailable } from "@vease/stores/updater";

const updaterAvailable = isUpdaterAvailable();
</script>
<template>
  <FeedBackSnackers />
  <UpdateSnackbar v-if="updaterAvailable" />

  <GlobalComponents />
  <HorizonStackDialog />
</template>
