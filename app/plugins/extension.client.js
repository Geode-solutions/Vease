import { VeaseExtensionAPI } from '../utils/extensionAPI.js'
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json"

/**
 * Extension API Plugin
 * Initializes the VeaseExtensionAPI and registers it with the app store
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Expose schemas globally for extensions
  window.__GEODE_BACK_SCHEMAS__ = back_schemas

  const appStore = useAppStore()
  const extensionAPI = new VeaseExtensionAPI()
  
  // Register the extension API with the app store
  appStore.setExtensionAPI(extensionAPI)
  
  // Provide the API to the Vue app so components can inject it
  nuxtApp.vueApp.provide('extensionAPI', extensionAPI)
  
  console.log('[Vease] Extension API initialized')
})
