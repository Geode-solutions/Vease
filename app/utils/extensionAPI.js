export class VeaseExtensionAPI {
  constructor({ schemas, uiStore, hybridViewerStore, dataBaseStore } = {}) {
    this._uiStore = uiStore
    this._hybridViewerStore = hybridViewerStore
    this._dataBaseStore = dataBaseStore
    this._importItem = null
    this._schemas = schemas || null
    this.currentExtensionId = null
  }

  get UIStore() {
    return this._uiStore
  }

  get HybridViewerStore() {
    return this._hybridViewerStore
  }

  get DataBaseStore() {
    return this._dataBaseStore
  }

  getSchemas() {
    return this._schemas
  }

  setCurrentExtensionId(id) {
    this.currentExtensionId = id
  }

  clearCurrentExtensionId() {
    this.currentExtensionId = null
  }

  registerTool(toolDefinition) {
    if (!toolDefinition.id) {
      throw new Error('Tool definition must have an id')
    }
    if (!toolDefinition.component) {
      throw new Error('Tool definition must have a component')
    }

    this.UIStore.registerToolComponent(toolDefinition, this.currentExtensionId)
  }

  unregisterTool(toolId) {
    this.UIStore.unregisterTool(toolId)
  }

  unregisterToolsByExtension(extensionId) {
    this.UIStore.unregisterToolsByExtension(extensionId)
  }

  get vue() {
    return {
      defineAsyncComponent,
      markRaw,
      ref,
      computed,
      watch,
      onMounted,
      onUnmounted,
      inject,
    }
  }

  get api_fetch() {
    return api_fetch
  }

  async importItem(data) {
    if (!this._importItem) {
      const module = await import('@ogw_front/utils/file_import_workflow.js')
      this._importItem = module.importItem
    }
    return this._importItem(data)
  }
}
