import { useAppStore } from "@ogw_front/stores/app"
import { useInfraStore } from "@ogw_front/stores/infra"
import { uploadExtension, runExtensions } from "@ogw_front/utils/extension"

export function useExtensionManager() {
  const infraStore = useInfraStore()
  const appStore = useAppStore()

  async function importExtensionFile(file) {
    await uploadExtension(file)
    const { extensionsArray } = await runExtensions()

    for (const extension of extensionsArray) {
      const { id, name, version, frontendContent, port } = extension
      const blob = new Blob([frontendContent], {
        type: "application/javascript",
      })
      const blobUrl = URL.createObjectURL(blob)
      const extensionModule = await appStore.loadExtension(blobUrl)
      console.log("[ExtensionManager] Extension loaded:", id)

      if (extensionModule.metadata?.store) {
        const storeFactory = extensionModule.metadata.store
        const store = storeFactory()
        store.$patch((state) => {
          state.default_local_port = port
        })
        appStore.registerStore(store)
        console.log("[ExtensionManager] Store registered:", store.$id)
        await store.connect()
        console.log("[ExtensionManager] Microservice connected:", store.$id)
        infraStore.register_microservice(store)
      }
      return {
        name,
        version,
        extensionModule,
      }
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
