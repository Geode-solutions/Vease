import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json"

export class VeaseExtensionAPI {
  constructor() {
    this._uiStore = null
    this._hybridViewerStore = null
    this._appStore = null
    this._dataBaseStore = null
    this._infraStore = null
    this._importItem = null
    this._schemas = back_schemas
  }

  get UIStore() {
    if (!this._uiStore) {
      this._uiStore = useUIStore()
    }
    return this._uiStore
  }

  get HybridViewerStore() {
    if (!this._hybridViewerStore) {
      this._hybridViewerStore = useHybridViewerStore()
    }
    return this._hybridViewerStore
  }

  get AppStore() {
    if (!this._appStore) {
      this._appStore = useAppStore()
    }
    return this._appStore
  }

  get DataBaseStore() {
    if (!this._dataBaseStore) {
      this._dataBaseStore = useDataBaseStore()
    }
    return this._dataBaseStore
  }

  get InfraStore() {
    if (!this._infraStore) {
      this._infraStore = useInfraStore()
    }
    return this._infraStore
  }

  getSchemas() {
    return this._schemas
  }

  registerTool(toolDefinition, extensionPath = null) {
    if (!toolDefinition.id) {
      throw new Error('Tool definition must have an id')
    }
    if (!toolDefinition.component) {
      throw new Error('Tool definition must have a component')
    }

    this.UIStore.registerToolComponent(toolDefinition, extensionPath)
  }

  unregisterTool(toolId) {
    this.UIStore.unregisterTool(toolId)
  }

  unregisterToolsByExtension(extensionPath) {
    this.UIStore.unregisterToolsByExtension(extensionPath)
  }

  getExtensionEnabled(extensionPath) {
    return this.AppStore.getExtensionEnabled(extensionPath)
  }

  registerMicroservice(microserviceConfig) {
    // microserviceConfig should contain:
    // - name: string
    // - useStore: function that returns the store instance
    // - request: function(store, schema, params, callbacks)
    // - connect: function(store)
    // - launch: function(store) [optional for CLOUD]
    // - electron_runner: string [optional for DESKTOP]
    this.InfraStore.register_microservice(microserviceConfig)
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
