export const useUIStore = defineStore("UI", {
  state: () => ({
    showDropZone: false,
    showStepper: false,
    droppedFiles: [],
    showButton: false,
  }),
  actions: {
    setShowDropZone(value) {
      this.showDropZone = value;
    },
    setShowStepper(value) {
      this.showStepper = value;
    },
    setDroppedFiles(files) {
      this.droppedFiles = files;
    },
    setShowButton(value) {
      this.showButton = value;
    },
    toggleDrawer() {
      this.droppedFiles = [];
      this.showStepper = !this.showStepper;
    },
  },
});
