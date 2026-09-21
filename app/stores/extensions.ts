import { transformExtensionCode } from "@vease/utils/extension_code_transformer";
import { useAppStore } from "@ogw_front/stores/app.js";

export function useExtensionsStore() {
  const appStore = useAppStore();

  appStore.setCodeTransformer(transformExtensionCode);

  return appStore;
}
