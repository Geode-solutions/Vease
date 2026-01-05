import { useUIStore } from "../stores/UI"
import { useDataStore } from "@ogw_front/stores/data"
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer"
import { useTreeviewStore } from "@ogw_front/stores/treeview"
import { useDataStyleStore } from "@ogw_front/stores/data_style"

export const useExtensionAPI = () => {
  const UIStore = useUIStore()
  const dataStore = useDataStore()
  const hybridViewerStore = useHybridViewerStore()
  const treeviewStore = useTreeviewStore()
  const dataStyleStore = useDataStyleStore()

  return {
    UIStore,
    dataStore,
    hybridViewerStore,
    treeviewStore,
    dataStyleStore,
    registerDataManagerTab: UIStore.registerDataManagerTab,
  }
}
