import { VeaseExtensionAPI } from "@vease/utils/extension_api";
import { useAppStore } from "@ogw_front/stores/app";
import { useBackStore } from "@ogw_front/stores/back";
import { useExtensionsStore } from "@vease/stores/extensions";
import { useFeedbackStore } from "@ogw_front/stores/feedback";
import { useInfraStore } from "@ogw_front/stores/infra";

export default defineNuxtPlugin(async (nuxtApp) => {
  if (typeof globalThis !== "undefined") {
    globalThis.Vue = await import("vue");
    globalThis.Pinia = await import("pinia");

    // Expose stores as factory functions - these are auto-imported by Nuxt
    globalThis.__VEASE_STORES__ = {
      useAppStore,
      useInfraStore,
      useFeedbackStore,
      useBackStore,
    };

    // Expose utilities for extensions
    const { api_fetch } = await import("@ogw_internal/utils/api_fetch.js");
    const StatusModule = await import("@ogw_front/utils/status.js");
    const appModeModule = await import("@geode/opengeodeweb-front/shared/app_mode.js");
    const { database } = await import("@geode/opengeodeweb-front/internal/database/database.js");
    globalThis.__VEASE_UTILS__ = {
      Status: StatusModule.Status,
      appMode: appModeModule.appMode,
      api_fetch,
      database,
    };

    // Expose schema JSON modules for extensions — each module is keyed by the same name it's
    // Imported under in extension source (e.g. `opengeodeweb_back_schemas.opengeodeweb_back`), so
    // The value here must be the whole default export, not just its nested key. Only schemas from
    // Packages Vease core already depends on belong here — an extension-specific schema package
    // (Like vease-modeling-back's) would make Vease's own build depend on that one extension.
    const opengeodewebBackSchemas = await import(
      "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json",
      { with: { type: "json" } }
    );
    globalThis.__VEASE_SCHEMAS__ = {
      opengeodeweb_back: opengeodewebBackSchemas.default,
    };
  }

  const extensionsStore = useExtensionsStore();
  const extensionAPI = VeaseExtensionAPI;

  extensionsStore.setExtensionAPI(extensionAPI);
  nuxtApp.vueApp.provide("extensionAPI", extensionAPI);

  console.log("[Vease] Extension system initialized");
});
