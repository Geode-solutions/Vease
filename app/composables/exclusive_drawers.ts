import { useCrsStore } from "@ogw_front/stores/crs";
import { useUserInterfaceStore } from "@vease/stores/user_interface";

// Only one of the stepper, create tools, extensions and CRS align panels is open at a time:
// Each of them may start its own picking in the viewer
function useExclusiveDrawers(): void {
  const userInterfaceStore = useUserInterfaceStore();
  const crsStore = useCrsStore();

  watch(
    () =>
      [
        userInterfaceStore.showStepper,
        userInterfaceStore.showCreateTools,
        userInterfaceStore.showExtensions,
        crsStore.showCrsAlign,
      ] as const,
    (
      [stepper, tools, extensions, crsAlign],
      [oldStepper, oldTools, oldExtensions, oldCrsAlign],
    ) => {
      if (stepper && !oldStepper) {
        userInterfaceStore.setShowCreateTools(false);
        userInterfaceStore.setShowExtensions(false);
        crsStore.closeCrsAlign();
      }
      if (tools && !oldTools) {
        userInterfaceStore.setShowStepper(false);
        userInterfaceStore.setShowExtensions(false);
        crsStore.closeCrsAlign();
      }
      if (extensions && !oldExtensions) {
        userInterfaceStore.setShowStepper(false);
        userInterfaceStore.setShowCreateTools(false);
        crsStore.closeCrsAlign();
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
