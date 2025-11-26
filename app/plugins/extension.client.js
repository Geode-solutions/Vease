import { VeaseExtensionAPI } from '../utils/extensionAPI.js'

/**
 * Extension API Plugin
 * Initializes the VeaseExtensionAPI and registers it with the app store
 */
export default defineNuxtPlugin((nuxtApp) => {
  const appStore = useAppStore()
  const extensionAPI = new VeaseExtensionAPI()
  
  // Register the extension API with the app store
  appStore.setExtensionAPI(extensionAPI)
  
  // Provide the API to the Vue app so components can inject it
  nuxtApp.vueApp.provide('extensionAPI', extensionAPI)
  
  console.log('[Vease] Extension API initialized')
})
