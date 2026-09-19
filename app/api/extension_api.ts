import { useUIStore } from "@vease/stores/ui";

export function useExtensionAPI(): {
  registerDataManagerTab: typeof UIStore.registerDataManagerTab;
} {
  const UIStore = useUIStore();

  return {
    registerDataManagerTab: UIStore.registerDataManagerTab,
  };
}
