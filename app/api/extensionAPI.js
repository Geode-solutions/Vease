import { useUIStore } from "@vease/stores/UI"

export const useExtensionAPI = () => {
  const UIStore = useUIStore()

  return {
    registerDataManagerTab: UIStore.registerDataManagerTab,
  }
}
