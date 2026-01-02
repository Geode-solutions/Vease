import { useUIStore } from "../stores/UI"
import { useDataBaseStore } from "@ogw_front/stores/data_base"
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer"
import { useTreeviewStore } from "@ogw_front/stores/treeview"
import { useDataStyleStore } from "@ogw_front/stores/data_style"

export const useExtensionAPI = () => {
  const UIStore = useUIStore()
  const dataBaseStore = useDataBaseStore()
  const hybridViewerStore = useHybridViewerStore()
  const treeviewStore = useTreeviewStore()
  const dataStyleStore = useDataStyleStore()

  return {
    UIStore,
    dataBaseStore,
    hybridViewerStore,
    treeviewStore,
    dataStyleStore,
    registerDataManagerTab: UIStore.registerDataManagerTab,
  }
}
