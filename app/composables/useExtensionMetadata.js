export function useExtensionMetadata() {
  const UIStore = useUIStore()

  const getExtensionName = (extension) => {
    if (!extension) return "Unknown Extension"
    if (extension.metadata?.name) return extension.metadata.name
    return extension.id || "Unknown Extension"
  }

  const getExtensionDescription = (extension) => {
    return extension?.metadata?.description || "Custom extension module"
  }

  const getExtensionVersion = (extension) => {
    return extension?.metadata?.version || null
  }

  const getExtensionTools = (extension) => {
    if (!extension) return []
    return UIStore.toolsDefinitions.filter(
      (tool) => tool.extensionPath === extension.id,
    )
  }

  const getExtensionToolsCount = (extension) => {
    return getExtensionTools(extension).length
  }

  return {
    getExtensionName,
    getExtensionDescription,
    getExtensionVersion,
    getExtensionTools,
    getExtensionToolsCount,
  }
}
