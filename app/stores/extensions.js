export const useExtensionsStore = defineStore("extensions", () => {
  const extensions = ref({})

  function getLoadedExtensions() {
    return Object.values(extensions.value)
  }

  function getExtension(extensionId) {
    return extensions.value[extensionId]
  }

  function getExtensionEnabled(extensionId) {
    return extensions.value[extensionId]?.enabled ?? false
  }

  async function loadExtension(blobUrl, backendPath) {
    const extensionModule = await import(/* @vite-ignore */ blobUrl)
    const extensionId = backendPath || blobUrl

    extensions.value[extensionId] = {
      id: extensionId,
      enabled: true,
      loadedAt: new Date().toISOString(),
      module: extensionModule,
      metadata: extensionModule.metadata || {},
    }

    if (extensionModule.install) {
      const { VeaseExtensionAPI } = await import("../utils/extensionAPI.js")
      const extensionAPI = new VeaseExtensionAPI()
      await extensionModule.install(extensionAPI, extensionId)
    }

    return extensionModule
  }

  function toggleExtension(extensionId) {
    if (extensions.value[extensionId]) {
      extensions.value[extensionId].enabled =
        !extensions.value[extensionId].enabled
    }
  }

  async function unloadExtension(extensionId) {
    if (extensions.value[extensionId]) {
      const extension = extensions.value[extensionId]
      if (extension.module?.uninstall) {
        const { VeaseExtensionAPI } = await import("../utils/extensionAPI.js")
        const extensionAPI = new VeaseExtensionAPI()
        await extension.module.uninstall(extensionAPI)
      }
      delete extensions.value[extensionId]
    }
  }

  function setExtensionAPI(api) {
    console.log("[ExtensionsStore] setExtensionAPI called", api)
  }

  return {
    extensions,
    getLoadedExtensions,
    getExtension,
    getExtensionEnabled,
    loadExtension,
    toggleExtension,
    unloadExtension,
    setExtensionAPI,
  }
})
