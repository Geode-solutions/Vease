import { useUserInterfaceStore } from "@vease/stores/user_interface";

export function useExtensionAPI(): {
  registerDataManagerTab: typeof userInterfaceStore.registerDataManagerTab;
} {
  const userInterfaceStore = useUserInterfaceStore();

  return {
    registerDataManagerTab: userInterfaceStore.registerDataManagerTab,
  };
}
