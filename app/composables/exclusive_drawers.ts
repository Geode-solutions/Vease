import { useUIStore } from "@vease/stores/ui";

// Only one of the stepper, create tools, extensions and CRS align drawers is open at a time.
function useExclusiveDrawers(): void {
  const UIStore = useUIStore();

  watch(
    () =>
      [
        UIStore.showStepper,
        UIStore.showCreateTools,
        UIStore.showExtensions,
        UIStore.showCrsAlign,
      ] as const,
    (
      [stepper, tools, extensions, crsAlign],
      [oldStepper, oldTools, oldExtensions, oldCrsAlign],
    ) => {
      if (stepper && !oldStepper) {
        UIStore.setShowCreateTools(false);
        UIStore.setShowExtensions(false);
        UIStore.setShowCrsAlign(false);
      }
      if (tools && !oldTools) {
        UIStore.setShowStepper(false);
        UIStore.setShowExtensions(false);
        UIStore.setShowCrsAlign(false);
      }
      if (extensions && !oldExtensions) {
        UIStore.setShowStepper(false);
        UIStore.setShowCreateTools(false);
        UIStore.setShowCrsAlign(false);
      }
      if (crsAlign && !oldCrsAlign) {
        UIStore.setShowStepper(false);
        UIStore.setShowCreateTools(false);
        UIStore.setShowExtensions(false);
      }
    },
  );
}

export { useExclusiveDrawers };
