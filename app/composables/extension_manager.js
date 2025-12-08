import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json"

export function useExtensionManager() {
  const appStore = useAppStore()
  const geodeStore = useGeodeStore()

  const importExtensionFile = async function (file) {
    console.log("[ExtensionManager] Importing extension file:", file.name)

    // Upload .vext to backend
    const schemaImport = back_schemas.opengeodeweb_back.import_extension
    const form = new FormData()
    form.append("file", file, file.name)

    const result = await $fetch(schemaImport.$id, {
      baseURL: geodeStore.base_url,
      method: "POST",
      body: form,
    })

    console.log("[ExtensionManager] Extension extracted:", result)

    const { extension_name, frontend_content, backend_path } = result

    // Create blob URL from frontend JS content
    const blob = new Blob([frontend_content], { type: "application/javascript" })
    const blobUrl = URL.createObjectURL(blob)

    // Load the extension module
    const extensionModule = await appStore.loadExtension(blobUrl, backend_path)

    console.log("[ExtensionManager] Extension loaded:", extension_name)

    // Register the store if present
    if (extensionModule.metadata?.store) {
      const storeFactory = extensionModule.metadata.store
      const store = storeFactory()
      appStore.registerStore(store)
      console.log("[ExtensionManager] Store registered:", store.$id)

      // Launch the microservice if the store has a launch method
      if (typeof store.launch === "function") {
        console.log("[ExtensionManager] Launching microservice...")
        await store.launch()
        await store.connect()
        console.log("[ExtensionManager] Microservice connected")
      }
    }

    return {
      extensionModule,
      extension_name,
      backend_path,
    }
  }

  const unloadExtension = async function (extensionId) {
    console.log("[ExtensionManager] Unloading extension:", extensionId)

    const extensionData = appStore.getExtension(extensionId)
    if (!extensionData) {
      console.warn("[ExtensionManager] Extension not found:", extensionId)
      return false
    }

    // Get the store if it exists
    const storeFactory = extensionData.metadata?.store
    if (storeFactory) {
      const store = storeFactory()
      // Stop the microservice if possible
      if (typeof store.kill === "function") {
        await store.kill()
      }
    }

    // Unload from AppStore
    appStore.unloadExtension(extensionId)

    console.log("[ExtensionManager] Extension unloaded:", extensionId)
    return true
  }

  return { importExtensionFile, unloadExtension }
}

export default useExtensionManager
