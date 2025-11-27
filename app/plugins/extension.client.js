import * as Vue from 'vue'
import * as Pinia from 'pinia'
import { VeaseExtensionAPI } from '../utils/extensionAPI.js'
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json"

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') {
    window.Vue = Vue
    window.Pinia = Pinia
  }
  
  const appStore = useAppStore()
  const extensionAPI = new VeaseExtensionAPI({ schemas: back_schemas })
  appStore.setExtensionAPI(extensionAPI)
  nuxtApp.vueApp.provide('extensionAPI', extensionAPI)

  console.log('[Vease] Extension system initialized')
})
