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

  function disableDropZone() {
    showDropZone.value = false
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
    showDropZone,
    showStepper,
    droppedFiles,
    showButton,
    showStepImportMenu,
    showCreateTools,
    showCreatePoint,
    showCreateAOI,
    showCreateVOI,
    disableDropZone,
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
