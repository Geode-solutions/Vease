import * as Vue from "vue"
import * as Pinia from "pinia"
import { VeaseExtensionAPI } from "../utils/extensionAPI.js"

export default defineNuxtPlugin((nuxtApp) => {
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

    // Utilities and schemas will be accessed from stores
    window.__VEASE_UTILS__ = {}
    window.__VEASE_SCHEMAS__ = {}
  }

  const extensionsStore = useExtensionsStore()
  const extensionAPI = new VeaseExtensionAPI()

  extensionsStore.setExtensionAPI(extensionAPI)
  nuxtApp.vueApp.provide("extensionAPI", extensionAPI)

  console.log("[Vease] Extension system initialized")
})
