import * as Vue from "vue"
import * as Pinia from "pinia"
import { VeaseExtensionAPI } from "../utils/extensionAPI.js"
import { useGeodeStore } from "@ogw_front/stores/geode"
import { useAppStore } from "@ogw_front/stores/app"
import { useInfraStore } from "@ogw_front/stores/infra"
import { useFeedbackStore } from "@ogw_front/stores/feedback"
import { useExtensionsStore } from "@vease/stores/extensions"

export default defineNuxtPlugin(async (nuxtApp) => {
  if (typeof window !== "undefined") {
    window.Vue = Vue
    window.Pinia = Pinia

    // Expose stores as factory functions - these are auto-imported by Nuxt
    window.__VEASE_STORES__ = {
      useAppStore,
      useInfraStore,
      useFeedbackStore,
      useGeodeStore,
    }

    // Expose utilities for extensions
    const { api_fetch } =
      await import("@geode/opengeodeweb-front/composables/api_fetch.js")
    window.__VEASE_UTILS__ = {
      Status: (await import("@ogw_front/utils/status.js")).default,
      appMode: (await import("@ogw_front/utils/app_mode.js")).appMode,
      api_fetch,
    }
    window.__VEASE_SCHEMAS__ = {}
  }

  const extensionsStore = useExtensionsStore()
  const extensionAPI = new VeaseExtensionAPI()

  extensionsStore.setExtensionAPI(extensionAPI)
  nuxtApp.vueApp.provide("extensionAPI", extensionAPI)

  console.log("[Vease] Extension system initialized")
})
