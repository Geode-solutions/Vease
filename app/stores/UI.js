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

  const registerToolComponent = (toolDefinition) => {
    const { id, component, ...rest } = toolDefinition
    const existingIndex = toolsDefinitions.value.findIndex(
      (tool) => tool.id === id,
    )
    const newDefinition = { id, component, ...rest }
    if (existingIndex !== -1) {
      toolsDefinitions.value[existingIndex] = {
        ...toolsDefinitions.value[existingIndex],
        ...newDefinition,
      }
    } else {
      toolsDefinitions.value.push(newDefinition)
    }
  }

  const activeTools = computed(() => toolsDefinitions.value)

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

  return {
    toolsDefinitions,
    activeTools,
    initializeDefaultTools,
    registerToolComponent,
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
  }
})
