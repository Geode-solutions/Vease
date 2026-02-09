import { useUIStore } from "@vease/stores/UI"

export function useExtensionAPI() {
  const UIStore = useUIStore()

  return {
    registerDataManagerTab: UIStore.registerDataManagerTab,
  }
}
