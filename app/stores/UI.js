export const useUIStore = defineStore("UI", () => {
  const showDropZone = ref(false)
  const showStepper = ref(false)
  const droppedFiles = ref([])
  const showButton = ref(false)
  const showStepImportMenu = ref(false)
  const showCreateTools = ref(false)
  const showCreatePoint = ref(false)
  const showCreateAOI = ref(false)
  const showCreateVOI = ref(false)
  const toolsDefinitions = ref([])

  const initializeDefaultTools = () => {
    const defaultTools = [
      {
        id: "Point",
        title: "Specific Point",
        description:
          "Create a point object with exact coordinates on the viewer.",
        iconType: "mdi",
        iconSource: "mdi-circle-medium",
        component: null,
      },
    ]
    toolsDefinitions.value = defaultTools
  }

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
      (tool) => tool.extensionPath !== extensionPath
    )
    const removedCount = beforeCount - toolsDefinitions.value.length
    console.log(`[UIStore] Removed ${removedCount} tools from extension: ${extensionPath}`)
  }

  const activeTools = computed(() => {
    const appStore = useAppStore()
    return toolsDefinitions.value.filter(tool => {
      if (!tool.extensionPath) return true
      return appStore.getExtensionEnabled(tool.extensionPath)
    })
  })

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

  function setShowCreatePoint(value) {
    showCreatePoint.value = value
  }

  function setShowCreateAOI(value) {
    showCreateAOI.value = value
  }

  function setShowCreateVOI(value) {
    showCreateVOI.value = value
  }

  const showExtensions = ref(false)
  function setShowExtensions(value) {
    showExtensions.value = value
  }

  return {
    toolsDefinitions,
    activeTools,
    initializeDefaultTools,
    registerToolComponent,
    unregisterTool,
    unregisterToolsByExtension,
    showDropZone,
    showStepper,
    droppedFiles,
    showButton,
    showStepImportMenu,
    showCreateTools,
    showCreatePoint,
    showCreateAOI,
    showCreateVOI,
    setShowDropZone,
    setShowStepper,
    setDroppedFiles,
    setShowButton,
    toggleDrawer,
    setShowCreateTools,
    setShowCreatePoint,
    setShowCreateAOI,
    setShowCreateVOI,
    showExtensions,
    setShowExtensions,
  }
})
