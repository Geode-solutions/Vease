import { VeaseExtensionAPI } from "../utils/extensionAPI.js"
import { useAppStore } from "@ogw_front/stores/app"
import { useExtensionsStore } from "@vease/stores/extensions"
import { useFeedbackStore } from "@ogw_front/stores/feedback"
import { useGeodeStore } from "@ogw_front/stores/geode"
import { useInfraStore } from "@ogw_front/stores/infra"

export default defineNuxtPlugin(async (nuxtApp) => {
  if (typeof window !== "undefined") {
    window.Vue = await import("vue")
    window.Pinia = await import("pinia")

    // Expose stores as factory functions - these are auto-imported by Nuxt
    window.__VEASE_STORES__ = {
      useAppStore,
      useInfraStore,
      useFeedbackStore,
      useGeodeStore,
    }

    // Expose utilities for extensions
    const { api_fetch } = await import(
      "@geode/opengeodeweb-front/internal/utils/api_fetch.js"
    )
    const StatusModule = await import("@ogw_front/utils/status.js")
    const appModeModule = await import("@ogw_front/utils/app_mode.js")
    window.__VEASE_UTILS__ = {
      Status: StatusModule.default,
      appMode: appModeModule.appMode,
      api_fetch,
    }
    window.__VEASE_SCHEMAS__ = {}
  }

  const extensionsStore = useExtensionsStore()
  const extensionAPI = VeaseExtensionAPI

  extensionsStore.setExtensionAPI(extensionAPI)
  nuxtApp.vueApp.provide("extensionAPI", extensionAPI)

  console.log("[Vease] Extension system initialized")
})
