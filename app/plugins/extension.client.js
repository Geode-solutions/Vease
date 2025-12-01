import * as Vue from 'vue'
import * as Pinia from 'pinia'
import { VeaseExtensionAPI } from '../utils/extensionAPI.js'

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') {
    window.Vue = Vue
    window.Pinia = Pinia
  }
  
  const extensionsStore = useExtensionsStore()
  
  const extensionAPI = new VeaseExtensionAPI()
  
  extensionsStore.setExtensionAPI(extensionAPI)
  nuxtApp.vueApp.provide('extensionAPI', extensionAPI)

  console.log('[Vease] Extension system initialized')
})
