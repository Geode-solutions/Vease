export function useExtensionMetadata() {
  const UIStore = useUIStore()

  const getExtensionName = (extension) => {
    if (!extension) return 'Unknown Extension'
    if (extension.metadata?.name) return extension.metadata.name
    const filename = (extension.path || '').split('/').pop()
    return filename.replace(/\.es\.js$/, '').replace(/[-_]/g, ' ')
  }

  const getExtensionDescription = (extension) => {
    return extension?.metadata?.description || 'Custom extension module'
  }

  const getExtensionVersion = (extension) => {
    return extension?.metadata?.version || null
  }

  const getExtensionTools = (extension) => {
    if (!extension) return []
    return UIStore.toolsDefinitions.filter(tool => tool.extensionPath === extension.path)
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
