export const useUIStore = defineStore("UI", () => {
  const showDropZone = ref(false)
  const showStepper = ref(false)
  const droppedFiles = ref([])
  const showButton = ref(false)
  const showStepImportMenu = ref(false)

  const showCreateTools = ref(false)
  const showCreatePoint = ref(false)
  const showCreateAOI = ref(false)

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

  function save() {
    return {
      showDropZone: showDropZone.value,
      showStepper: showStepper.value,
      droppedFiles: droppedFiles.value,
      showButton: showButton.value,
      showStepImportMenu: showStepImportMenu.value,
      showCreateTools: showCreateTools.value,
      showCreatePoint: showCreatePoint.value,
      showCreateAOI: showCreateAOI.value,
    }
  }

  async function load(snapshot) {
    if (!snapshot) return
    showDropZone.value = snapshot.showDropZone ?? showDropZone.value
    showStepper.value = snapshot.showStepper ?? showStepper.value
    droppedFiles.value = snapshot.droppedFiles ?? droppedFiles.value
    showButton.value = snapshot.showButton ?? showButton.value
    showStepImportMenu.value =
      snapshot.showStepImportMenu ?? showStepImportMenu.value
    showCreateTools.value = snapshot.showCreateTools ?? showCreateTools.value
    showCreatePoint.value = snapshot.showCreatePoint ?? showCreatePoint.value
    showCreateAOI.value = snapshot.showCreateAOI ?? showCreateAOI.value
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
    disableDropZone,
    setShowDropZone,
    setShowStepper,
    setDroppedFiles,
    setShowButton,
    toggleDrawer,
    setShowCreateTools,
    setShowCreatePoint,
    setShowCreateAOI,
    save,
    load,
  }
})
