import { useUIStore } from "@vease/stores/UI"

function getExtensionName(extension) {
  if (!extension) return "Unknown Extension"
  if (extension.metadata?.name) return extension.metadata.name
  return extension.id || "Unknown Extension"
}

function getExtensionDescription(extension) {
  return extension?.metadata?.description || "Custom extension module"
}

function getExtensionVersion(extension) {
  return extension?.metadata?.version || null
}

export function useExtensionMetadata() {
  const UIStore = useUIStore()

  function getExtensionTools(extension) {
    if (!extension) return []
    return UIStore.toolsDefinitions.filter(
      (tool) => tool.extensionPath === extension.id,
    )
  }

  function getExtensionToolsCount(extension) {
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
