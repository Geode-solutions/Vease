import { useAppSetting } from "@vease/composables/app_setting";
import { useCrsStore } from "@ogw_front/stores/crs";

// The favorite and recent CRS live in the desktop settings, kept across launches.
// A plugin: it runs before any page or CRS selector reads them
export default defineNuxtPlugin(() => {
  useCrsStore().setCrsShortlistStorage(
    useAppSetting("crsFavorites", "vease-crs-favorites", []),
    useAppSetting("crsHistory", "vease-crs-history", []),
  );
});
