import { transformExtensionCode } from '../utils/extensionCodeTransformer.js'
import { useAppStore } from '@ogw_front/stores/app.js'

export function useExtensionsStore() {
  const appStore = useAppStore()
  
  const originalLoadExtension = appStore.loadExtension
  
  appStore.loadExtension = async function(path) {
    return await originalLoadExtension.call(this, path, transformExtensionCode)
  }
  
  return appStore
}
