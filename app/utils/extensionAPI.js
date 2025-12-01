export class VeaseExtensionAPI {
  registerTool(extensionId, toolDefinition) {
    if (!toolDefinition.id) {
      throw new Error('Tool definition must have an id')
    }
    if (!toolDefinition.component) {
      throw new Error('Tool definition must have a component')
    }

    useUIStore().registerToolComponent(toolDefinition, extensionId)
  }

  unregisterTool(toolId) {
    useUIStore().unregisterTool(toolId)
  }

  unregisterToolsByExtension(extensionId) {
    useUIStore().unregisterToolsByExtension(extensionId)
  }
}
