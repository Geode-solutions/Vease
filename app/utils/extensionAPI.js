import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json"
import vease_back_schemas from "@geode/vease-back/vease_back_schemas.json"
import { importItem } from "@ogw_front/utils/file_import_workflow.js"
import { useAppStore } from "@ogw_front/stores/app"
import { useDataStore } from "@ogw_front/stores/data"
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer"
import { useUIStore } from "@vease/stores/UI"

export class VeaseExtensionAPI {
  registerTool(extensionId, toolDefinition) {
    if (!toolDefinition.id) {
      throw new Error("Tool definition must have an id")
    }
    if (!toolDefinition.component) {
      throw new Error("Tool definition must have a component")
    }
    useUIStore().registerToolComponent(toolDefinition, extensionId)
  }

  unregisterTool(toolId) {
    useUIStore().unregisterTool(toolId)
  }

  unregisterToolsByExtension(extensionId) {
    useUIStore().unregisterToolsByExtension(extensionId)
  }

  getSchemas() {
    return {
      opengeodeweb_back: back_schemas.opengeodeweb_back,
      vease_back: vease_back_schemas.vease_back,
    }
  }

  importItem(item) {
    return importItem(item)
  }

  registerStore(store) {
    const appStore = useAppStore()
    appStore.registerStore(store)
  }

  get UIStore() {
    return useUIStore()
  }

  get DataBaseStore() {
    return useDataStore()
  }

  get HybridViewerStore() {
    return useHybridViewerStore()
  }

  get AppStore() {
    return useAppStore()
  }
}
