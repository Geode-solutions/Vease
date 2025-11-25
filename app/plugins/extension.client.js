import { VeaseExtensionAPI } from '../utils/extensionAPI.js'

/**
 * Extension API Plugin
 * Initializes the VeaseExtensionAPI and registers it with the app store
 */
export default defineNuxtPlugin(() => {
  const appStore = useAppStore()
  const extensionAPI = new VeaseExtensionAPI()
  
  // Register the extension API with the app store
  appStore.setExtensionAPI(extensionAPI)
  
  console.log('[Vease] Extension API initialized')
})
