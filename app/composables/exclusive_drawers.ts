import { useUserInterfaceStore } from "@vease/stores/user_interface";

// Only one of the stepper, create tools, extensions and CRS align drawers is open at a time.
function useExclusiveDrawers(): void {
  const userInterfaceStore = useUserInterfaceStore();

  watch(
    () =>
      [
        userInterfaceStore.showStepper,
        userInterfaceStore.showCreateTools,
        userInterfaceStore.showExtensions,
        userInterfaceStore.showCrsAlign,
      ] as const,
    (
      [stepper, tools, extensions, crsAlign],
      [oldStepper, oldTools, oldExtensions, oldCrsAlign],
    ) => {
      if (stepper && !oldStepper) {
        userInterfaceStore.setShowCreateTools(false);
        userInterfaceStore.setShowExtensions(false);
        userInterfaceStore.setShowCrsAlign(false);
      }
      if (tools && !oldTools) {
        userInterfaceStore.setShowStepper(false);
        userInterfaceStore.setShowExtensions(false);
        userInterfaceStore.setShowCrsAlign(false);
      }
      if (extensions && !oldExtensions) {
        userInterfaceStore.setShowStepper(false);
        userInterfaceStore.setShowCreateTools(false);
        userInterfaceStore.setShowCrsAlign(false);
      }
      if (crsAlign && !oldCrsAlign) {
        userInterfaceStore.setShowStepper(false);
        userInterfaceStore.setShowCreateTools(false);
        userInterfaceStore.setShowExtensions(false);
      }
    },
  );
}

export { useExclusiveDrawers };
