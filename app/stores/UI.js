import { useExtensionsStore } from "@vease/stores/extensions"

export const useUIStore = defineStore("UI", () => {
  const showDropZone = ref(false)
  const showStepper = ref(false)
  const droppedFiles = ref([])
  const showButton = ref(false)
  const showStepImportMenu = ref(false)
  const showCreateTools = ref(false)
  const toolsDefinitions = ref([])
  const showExtensions = ref(false)
  const dataManagerTabs = ref([])

  const registerToolComponent = (toolDefinition, extensionPath = null) => {
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

  const unregisterTool = (toolId) => {
    const index = toolsDefinitions.value.findIndex((tool) => tool.id === toolId)
    if (index !== -1) {
      toolsDefinitions.value.splice(index, 1)
      console.log(`[UIStore] Tool unregistered: ${toolId}`)
    }
  }

  const unregisterToolsByExtension = (extensionPath) => {
    const beforeCount = toolsDefinitions.value.length
    toolsDefinitions.value = toolsDefinitions.value.filter(
      (tool) => tool.extensionPath !== extensionPath,
    )
    const removedCount = beforeCount - toolsDefinitions.value.length
    console.log(
      `[UIStore] Removed ${removedCount} tools from extension: ${extensionPath}`,
    )
  }

  const activeTools = computed(() => {
    const extensionsStore = useExtensionsStore()
    return toolsDefinitions.value.filter((tool) => {
      if (!tool.extensionPath) return true
      return extensionsStore.getExtensionEnabled(tool.extensionPath)
    })
  })
  const registerDataManagerTab = (tabDefinition) => {
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

  return {
    toolsDefinitions,
    activeTools,
    dataManagerTabs,
    registerToolComponent,
    registerDataManagerTab,
    unregisterTool,
    unregisterToolsByExtension,
    showDropZone,
    showStepper,
    droppedFiles,
    showButton,
    showStepImportMenu,
    showCreateTools,
    showExtensions,
    setShowDropZone,
    setShowStepper,
    setDroppedFiles,
    setShowButton,
    toggleDrawer,
    setShowCreateTools,
    setShowExtensions,
  }
})
