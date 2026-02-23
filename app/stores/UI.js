import { useExtensionsStore } from "@vease/stores/extensions"

export const useUIStore = defineStore("UI", () => {
  const showDropZone = ref(false)
  const showStepper = ref(false)
  const droppedFiles = ref([])
  const showButton = ref(false)
  const showStepImportMenu = ref(false)
  const showCreateTools = ref(false)
  const toolsDefinitions = ref([])
  const showCreateVOI = ref(false)
  const showCreateAOI = ref(false)
  const showExtensions = ref(false)
  const dataManagerTabs = ref([])
  const dataTableColumns = ref([])
  const batchActions = ref([])

  const anyOverlayOpen = computed(
    () => showStepper.value || showCreateTools.value || showExtensions.value,
  )

  function registerToolComponent(toolDefinition, extensionPath = null) {
    const { id, component, ...rest } = toolDefinition
    const existingIndex = toolsDefinitions.value.findIndex(
      (tool) => tool.id === id,
    )
    const newDefinition = { id, component, extensionPath, ...rest }
    if (existingIndex !== -1) {
      toolsDefinitions.value[existingIndex] = {
        ...toolsDefinitions.value[existingIndex],
        ...newDefinition,
      }
    } else {
      toolsDefinitions.value.push(newDefinition)
    }
  }

  function unregisterTool(toolId) {
    const index = toolsDefinitions.value.findIndex((tool) => tool.id === toolId)
    if (index !== -1) {
      toolsDefinitions.value.splice(index, 1)
      console.log(`[UIStore] Tool unregistered: ${toolId}`)
    }
  }

  function unregisterToolsByExtension(extensionPath) {
    const beforeCount = toolsDefinitions.value.length
    toolsDefinitions.value = toolsDefinitions.value.filter(
      (tool) => tool.extensionPath !== extensionPath,
    )
    const removedCount = beforeCount - toolsDefinitions.value.length
    console.log(
      `[UIStore] Removed ${removedCount} tools from extension: ${extensionPath}`,
    )
  }

  function getActiveTools() {
    const extensionsStore = useExtensionsStore()
    return toolsDefinitions.value.filter((tool) => {
      if (!tool.extensionPath) return true
      return extensionsStore.getExtensionEnabled(tool.extensionPath)
    })
  }

  const activeTools = computed(getActiveTools)

  function registerDataManagerTab(tabDefinition) {
    const { id, component, ...rest } = tabDefinition
    const existingIndex = dataManagerTabs.value.findIndex(
      (tab) => tab.id === id,
    )
    const newDefinition = { id, component, ...rest }
    if (existingIndex !== -1) {
      dataManagerTabs.value[existingIndex] = {
        ...dataManagerTabs.value[existingIndex],
        ...newDefinition,
      }
    } else {
      dataManagerTabs.value.push(newDefinition)
    }
  }

  function setShowDropZone(value) {
    showDropZone.value = value
  }

  function setShowStepper(value) {
    showStepper.value = value
  }

  function setDroppedFiles(files) {
    droppedFiles.value = files
  }

  function setShowButton(value) {
    showButton.value = value
  }

  function toggleDrawer() {
    droppedFiles.value = []
    showStepper.value = !showStepper.value
  }

  function setShowCreateTools(value) {
    showCreateTools.value = value
  }

  function setShowExtensions(value) {
    showExtensions.value = value
  }

  function setShowCreateVOI(value) {
    showCreateVOI.value = value
  }

  function setShowCreateAOI(value) {
    showCreateAOI.value = value
  }

  function registerDataTableColumn(columnDefinition, extensionPath = null) {
    const { key, title, component, ...rest } = columnDefinition
    const existingIndex = dataTableColumns.value.findIndex(
      (col) => col.key === key,
    )
    const newDefinition = { key, title, component, extensionPath, ...rest }
    if (existingIndex !== -1) {
      dataTableColumns.value[existingIndex] = {
        ...dataTableColumns.value[existingIndex],
        ...newDefinition,
      }
    } else {
      dataTableColumns.value.push(newDefinition)
    }
  }

  function unregisterDataTableColumnsByExtension(extensionPath) {
    dataTableColumns.value = dataTableColumns.value.filter(
      (col) => col.extensionPath !== extensionPath,
    )
  }

  function registerBatchAction(actionDefinition) {
    const { id, component, extensionPath, ...rest } = actionDefinition
    const existingIndex = batchActions.value.findIndex(
      (action) => action.id === id,
    )
    const newDefinition = { id, component, extensionPath, ...rest }
    if (existingIndex !== -1) {
      batchActions.value[existingIndex] = {
        ...batchActions.value[existingIndex],
        ...newDefinition,
      }
    } else {
      batchActions.value.push(newDefinition)
    }
  }

  function unregisterBatchActionsByExtension(extensionPath) {
    batchActions.value = batchActions.value.filter(
      (action) => action.extensionPath !== extensionPath,
    )
  }

  return {
    toolsDefinitions,
    activeTools,
    dataManagerTabs,
    dataTableColumns,
    batchActions,
    registerToolComponent,
    registerDataManagerTab,
    registerDataTableColumn,
    registerBatchAction,
    unregisterTool,
    unregisterToolsByExtension,
    unregisterDataTableColumnsByExtension,
    unregisterBatchActionsByExtension,
    showDropZone,
    showStepper,
    droppedFiles,
    showButton,
    showStepImportMenu,
    showCreateTools,
    showExtensions,
    showCreateVOI,
    showCreateAOI,
    anyOverlayOpen,
    setShowDropZone,
    setShowStepper,
    setDroppedFiles,
    setShowButton,
    toggleDrawer,
    setShowCreateTools,
    setShowExtensions,
    setShowCreateVOI,
    setShowCreateAOI,
  }
})
