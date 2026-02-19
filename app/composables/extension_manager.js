import { useAppStore } from "@ogw_front/stores/app"
import { useInfraStore } from "@ogw_front/stores/infra"
import { appMode } from "@ogw_front/utils/app_mode"
import { uploadExtension } from "@ogw_front/utils/extension"

export function useExtensionManager() {
  const infraStore = useInfraStore()
  const appStore = useAppStore()

  async function importExtensionFile(file) {
    const archiveFileContent = await file.text()
    console.log("[ExtensionManager] Importing extension file:", file.name)

    await uploadExtension(archiveFileContent, file.name, "vease")

    if (infraStore.app_mode === appMode.BROWSER) {
      console.log(
        "[ExtensionManager] Cannot import extension in BROWSER mode, please reload the page",
      )
      return "Extension uploaded, please reload the page"
    } else if (infraStore.app_mode === appMode.DESKTOP) {
      console.log("[ExtensionManager] Importing extension in DESKTOP mode...")
    }

    const {
      extension_name,
      extension_version,
      frontend_content,
      backend_path,
    } = result
    console.log("[ExtensionManager] Extension extracted", extension_name)

    // Create blob URL from frontend JS content
    const blob = new Blob([frontend_content], {
      type: "application/javascript",
    })
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
        if (infraStore.app_mode === "DESKTOP") {
          console.log(
            "[ExtensionManager] Launching microservice in DESKTOP mode...",
          )
          await store.launch(backend_path)
          await store.connect()
          console.log("[ExtensionManager] Microservice connected")
        } else if (infraStore.app_mode === "BROWSER") {
          console.log(
            "[ExtensionManager] Launching microservice in BROWSER mode...",
          )
          await store.launch(backend_path)
          await store.connect()
          console.log("[ExtensionManager] Microservice connected")
        } else {
          console.log(
            `[ExtensionManager] Skipping microservice launch in ${infraStore.app_mode} mode`,
          )
        }
        infraStore.register_microservice(store)
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
