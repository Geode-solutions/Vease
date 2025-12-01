import * as Vue from "vue"
import { useUIStore } from "../stores/UI"

export class VeaseExtensionAPI {
  constructor() {
    this.vue = Vue
    this.uiStore = useUIStore()
    this.currentExtensionId = null
  }

  setCurrentExtensionId(id) {
    this.currentExtensionId = id
  }

  clearCurrentExtensionId() {
    this.currentExtensionId = null
  }

  registerTool(toolDefinition) {
    this.uiStore.registerToolComponent(toolDefinition, this.currentExtensionId)
  }

  unregisterToolsByExtension(extensionId) {
    this.uiStore.unregisterToolsByExtension(extensionId)
  }
}
