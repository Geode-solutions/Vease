import { useAppStore } from "@ogw_front/stores/app"
import { useInfraStore } from "@ogw_front/stores/infra"
import { uploadExtension, runExtensions } from "@ogw_front/utils/extension"

import { appMode } from "@ogw_front/utils/app_mode"

export function useExtensionManager() {
  const infraStore = useInfraStore()
  const appStore = useAppStore()

  async function importExtensionFile(file) {
    await uploadExtension(file)
    const runningExtensions = await runExtensions()

    console.log("[ExtensionManager] Extension imported", runningExtensions)

    for (const runningExtension of runningExtensions) {
      const {
        extension_id,
        extension_name,
        extension_version,
        frontend_content,
        backend_path,
      } = runningExtension
      console.log("[ExtensionManager] Extension extracted", extension_name)

      // Create blob URL from frontend JS content
      const blob = new Blob([frontend_content], {
        type: "application/javascript",
      })
      const blobUrl = URL.createObjectURL(blob)

      // Load the extension module
      const extensionModule = await appStore.loadExtension(
        blobUrl,
        backend_path,
      )

      console.log("[ExtensionManager] Extension loaded:", extension_name)
      // Register the store if present
      if (extensionModule.metadata?.store) {
        const storeFactory = extensionModule.metadata.store
        const store = storeFactory()
        appStore.registerStore(store)
        console.log("[ExtensionManager] Store registered:", store.$id)

        // Launch the microservice if the store has a launch method
        if (typeof store.launch === "function") {
          if (infraStore.app_mode !== appMode.CLOUD) {
            console.log(
              `[ExtensionManager] Launching microservice in ${infraStore.app_mode} mode...`,
            )
            await store.launch(backend_path)
            await store.connect()
            console.log("[ExtensionManager] Microservice connected")
          }
          infraStore.register_microservice(store)
        }
      }
    }

    return {
      extension_name,
      extension_version,
      extensionModule,
      backend_path,
    }
  }

  async function unloadExtension(extensionId) {
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
