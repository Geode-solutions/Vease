/**
 * VeaseExtensionAPI
 * 
 * API exposed to extensions for interacting with Vease application
 * Provides access to stores, tool registration, and UI interactions
 */
export class VeaseExtensionAPI {
  constructor() {
    this._uiStore = null
    this._hybridViewerStore = null
    this._appStore = null
    this._dataBaseStore = null
  }

  /**
   * Get the UI Store
   */
  get UIStore() {
    if (!this._uiStore) {
      this._uiStore = useUIStore()
    }
    return this._uiStore
  }

  /**
   * Get the HybridViewer Store
   */
  get HybridViewerStore() {
    if (!this._hybridViewerStore) {
      this._hybridViewerStore = useHybridViewerStore()
    }
    return this._hybridViewerStore
  }

  /**
   * Get the App Store (from OpenGeodeWeb-Front)
   */
  get AppStore() {
    if (!this._appStore) {
      this._appStore = useAppStore()
    }
    return this._appStore
  }

  /**
   * Get the DataBase Store
   */
  get DataBaseStore() {
    if (!this._dataBaseStore) {
      this._dataBaseStore = useDataBaseStore()
    }
    return this._dataBaseStore
  }

  /**
   * Register a tool component
   * @param {Object} toolDefinition - Tool definition object
   * @param {string} toolDefinition.id - Unique tool identifier
   * @param {string} toolDefinition.title - Tool display title
   * @param {string} toolDefinition.description - Tool description
   * @param {string} toolDefinition.iconType - Icon type ('mdi' or 'svg')
   * @param {string} toolDefinition.iconSource - Icon source (mdi icon name or svg path)
   * @param {Component} toolDefinition.component - Vue component (must be markRaw)
   * @param {string} extensionPath - Optional path of the extension registering this tool
   */
  registerTool(toolDefinition, extensionPath = null) {
    if (!toolDefinition.id) {
      throw new Error('Tool definition must have an id')
    }
    if (!toolDefinition.component) {
      throw new Error('Tool definition must have a component')
    }

    this.UIStore.registerToolComponent(toolDefinition, extensionPath)
  }

  /**
   * Unregister a specific tool by ID
   * @param {string} toolId - ID of the tool to unregister
   */
  unregisterTool(toolId) {
    this.UIStore.unregisterTool(toolId)
  }

  /**
   * Unregister all tools registered by a specific extension
   * @param {string} extensionPath - Path of the extension whose tools should be removed
   */
  unregisterToolsByExtension(extensionPath) {
    this.UIStore.unregisterToolsByExtension(extensionPath)
  }

  /**
   * Access to Vue utilities
   */
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

  /**
   * Access to api_fetch utility
   */
  get api_fetch() {
    return api_fetch
  }
}
