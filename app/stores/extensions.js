import { transformExtensionCode } from '../utils/extensionCodeTransformer.js'

export const useExtensionsStore = defineStore("extensions", () => {
  const loadedExtensions = ref(new Map())
  const extensionAPI = ref(null)

  function setExtensionAPI(api) {
    extensionAPI.value = api
  }
  function getExtension(path) {
    return loadedExtensions.value.get(path)
  }

  async function loadExtension(path) {
    try {
      if (loadedExtensions.value.has(path)) {
        console.warn(`[ExtensionsStore] Extension already loaded from this path: ${path}`)
        throw new Error('This extension file is already loaded')
      }

      if (!extensionAPI.value) {
        throw new Error("Extension API not initialized")
      }

      let finalURL = path

      if (path.startsWith('blob:')) {
        const response = await fetch(path)
        const code = await response.text()
        const transformedCode = transformExtensionCode(code)

        const newBlob = new Blob([transformedCode], { type: 'application/javascript' })
        finalURL = URL.createObjectURL(newBlob)
      }

      const extensionModule = await import(finalURL)

      if (finalURL !== path && finalURL.startsWith('blob:')) {
        URL.revokeObjectURL(finalURL)
      }

      const extensionName = extensionModule.metadata?.name
      if (extensionName) {
        const alreadyLoaded = Array.from(loadedExtensions.value.values()).find(
          ext => ext.metadata?.name === extensionName
        )
        if (alreadyLoaded) {
          console.warn(`[ExtensionsStore] Extension "${extensionName}" is already loaded`)
          throw new Error(`Extension "${extensionName}" is already loaded.`)
        }
      }

      if (typeof extensionModule.install === 'function') {
        await extensionModule.install(extensionAPI.value, path)
        
        const extensionData = {
          module: extensionModule,
          path,
          loadedAt: new Date().toISOString(),
          metadata: extensionModule.metadata || {},
          enabled: true,
        }
        loadedExtensions.value.set(path, extensionData)

        console.log(`[ExtensionsStore] Extension loaded successfully: ${path}`)

        return extensionModule
      } else {
        throw new Error('Extension must export an install function')
      }
    } catch (error) {
      console.error(`[ExtensionsStore] Failed to load extension from ${path}:`, error)
      throw error
    }
  }

  function getLoadedExtensions() {
    return Array.from(loadedExtensions.value.values())
  }

  function unloadExtension(path) {
    const extensionData = getExtension(path)
    if (!extensionData) return false
    
    if (extensionData.module && typeof extensionData.module.uninstall === 'function') {
      try {
        extensionData.module.uninstall(extensionAPI.value, path)
        console.log(`[ExtensionsStore] Extension uninstall called: ${path}`)
      } catch (error) {
        console.error(`[ExtensionsStore] Error calling uninstall for ${path}:`, error)
      }
    }
    
    if (extensionAPI.value) {
      extensionAPI.value.unregisterToolsByExtension(path)
    }
    
    loadedExtensions.value.delete(path)
    console.log(`[ExtensionsStore] Extension unloaded: ${path}`)
    return true
  }

  function toggleExtension(path) {
    const extensionData = getExtension(path)
    if (!extensionData) return false
    
    extensionData.enabled = !extensionData.enabled
    console.log(`[ExtensionsStore] Extension ${extensionData.enabled ? 'enabled' : 'disabled'}: ${path}`)
    return extensionData.enabled
  }

  function setExtensionEnabled(path, enabled) {
    const extensionData = getExtension(path)
    if (!extensionData) return false
    
    extensionData.enabled = enabled
    console.log(`[ExtensionsStore] Extension ${enabled ? 'enabled' : 'disabled'}: ${path}`)
    return true
  }

  function getExtensionEnabled(path) {
    return getExtension(path)?.enabled ?? false
  }

  return {
    loadedExtensions,
    setExtensionAPI,
    loadExtension,
    getLoadedExtensions,
    unloadExtension,
    toggleExtension,
    setExtensionEnabled,
    getExtensionEnabled,
  }
})
