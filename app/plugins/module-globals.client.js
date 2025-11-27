/**
 * Module Globals Plugin
 * Exposes Vue and Pinia as global references for extensions
 */
import * as Vue from 'vue'
import * as Pinia from 'pinia'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Expose modules globally for extensions
    window.__VUE_RUNTIME__ = Vue
    window.__PINIA__ = Pinia
    
    console.log('[Vease] Module globals initialized for extensions')
  }
})
