export const useUIStore = defineStore("UI", () => {
  const showDropZone = ref(false);
  const showStepper = ref(false);
  const droppedFiles = ref([]);
  const showButton = ref(false);
  const showStepImportMenu = ref(false);
  const showCreatePointMenu = ref(false);

  function disableDropZone() {
    showDropZone.value = false;
  }
  function setShowDropZone(value) {
    showDropZone.value = value;
  }
  function setShowStepper(value) {
    showStepper.value = value;
  }
  function setDroppedFiles(files) {
    droppedFiles.value = files;
  }
  function setShowButton(value) {
    showButton.value = value;
  }

  function toggleDrawer() {
    droppedFiles.value = [];
    showStepper.value = !showStepper.value;
  }

  function setShowCreatePointMenu(value) {
    showCreatePointMenu.value = value;
  }

  return {
    showDropZone,
    showStepper,
    droppedFiles,
    showButton,
    showStepImportMenu,
    showCreatePointMenu,
    disableDropZone,
    setShowDropZone,
    setShowStepper,
    setDroppedFiles,
    setShowButton,
    toggleDrawer,
    setShowCreatePointMenu,
  };
});
