import { VeaseExtensionAPI } from '../utils/extensionAPI.js'

export default defineNuxtPlugin((nuxtApp) => {
  const appStore = useAppStore()
  const extensionAPI = new VeaseExtensionAPI()

  appStore.setExtensionAPI(extensionAPI)

  nuxtApp.vueApp.provide('extensionAPI', extensionAPI)

  console.log('[Vease] Extension API initialized')
})
