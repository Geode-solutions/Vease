import * as Vue from "vue"
import { useUIStore } from "../stores/UI"

export class VeaseExtensionAPI {
  constructor() {
    this.vue = Vue
    this.uiStore = useUIStore()
  }

  registerTool(toolDefinition) {
    this.uiStore.registerToolComponent(toolDefinition)
  }
}
