import { useCrsStore } from "@ogw_front/stores/crs";
import { useUIStore } from "@vease/stores/ui";

// Only one of the stepper, create tools, extensions and CRS align panels is open at a time:
// Each of them may start its own picking in the viewer
function useExclusiveDrawers(): void {
  const UIStore = useUIStore();
  const crsStore = useCrsStore();

  watch(
    () =>
      [
        UIStore.showStepper,
        UIStore.showCreateTools,
        UIStore.showExtensions,
        crsStore.showCrsAlign,
      ] as const,
    (
      [stepper, tools, extensions, crsAlign],
      [oldStepper, oldTools, oldExtensions, oldCrsAlign],
    ) => {
      if (stepper && !oldStepper) {
        UIStore.setShowCreateTools(false);
        UIStore.setShowExtensions(false);
        crsStore.closeCrsAlign();
      }
      if (tools && !oldTools) {
        UIStore.setShowStepper(false);
        UIStore.setShowExtensions(false);
        crsStore.closeCrsAlign();
      }
      if (extensions && !oldExtensions) {
        UIStore.setShowStepper(false);
        UIStore.setShowCreateTools(false);
        crsStore.closeCrsAlign();
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
