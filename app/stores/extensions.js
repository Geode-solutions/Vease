import { transformExtensionCode } from '../utils/extensionCodeTransformer.js'
import { useAppStore } from '@ogw_front/stores/app.js'

export function useExtensionsStore() {
  const appStore = useAppStore()
  
  appStore.setCodeTransformer(transformExtensionCode)
  
  return appStore
}
