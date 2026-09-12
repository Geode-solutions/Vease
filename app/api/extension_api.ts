import { useUIStore } from "@vease/stores/ui";

export function useExtensionAPI() {
  const UIStore = useUIStore();

  return {
    registerDataManagerTab: UIStore.registerDataManagerTab,
  };
}
