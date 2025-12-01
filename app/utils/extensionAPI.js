export class VeaseExtensionAPI {
  constructor() {
    this.currentExtensionId = null
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

    useUIStore().registerToolComponent(toolDefinition, this.currentExtensionId)
  }

  unregisterTool(toolId) {
    useUIStore().unregisterTool(toolId)
  }

  unregisterToolsByExtension(extensionId) {
    useUIStore().unregisterToolsByExtension(extensionId)
  }
}
