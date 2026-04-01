import { transformExtensionCode } from "@vease/utils/extension_code_transformer.js";
import { useAppStore } from "@ogw_front/stores/app.js";

export function useExtensionsStore() {
  const appStore = useAppStore();

  appStore.setCodeTransformer(transformExtensionCode);

  return appStore;
}
