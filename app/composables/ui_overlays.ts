import { useCrsStore } from "@ogw_front/stores/crs";

interface UiOverlays {
  showStepper: Ref<boolean>;
  showCreateTools: Ref<boolean>;
  showExtensions: Ref<boolean>;
  anyOverlayOpen: ComputedRef<boolean>;
  setShowStepper: (value: boolean) => void;
  setShowCreateTools: (value: boolean) => void;
  setShowExtensions: (value: boolean) => void;
  closeAllDrawers: () => void;
}

function useUiOverlays(): UiOverlays {
  const showStepper = ref(false);
  const showCreateTools = ref(false);
  const showExtensions = ref(false);

  const anyOverlayOpen = computed(
    () => showStepper.value || showCreateTools.value || showExtensions.value,
  );

  function setShowStepper(value: boolean): void {
    showStepper.value = value;
  }

  function setShowCreateTools(value: boolean): void {
    showCreateTools.value = value;
  }

  function setShowExtensions(value: boolean): void {
    showExtensions.value = value;
  }

  // The overlays counted by anyOverlayOpen
  function closeAllDrawers(): void {
    showStepper.value = false;
    showCreateTools.value = false;
    showExtensions.value = false;
    // The CRS alignment is a floating panel of the viewer, closed with the drawers
    useCrsStore().closeCrsAlign();
  }

  return {
    showStepper,
    showCreateTools,
    showExtensions,
    anyOverlayOpen,
    setShowStepper,
    setShowCreateTools,
    setShowExtensions,
    closeAllDrawers,
  };
}

interface UiPanels {
  showCreateVOI: Ref<boolean>;
  showCreateAOI: Ref<boolean>;
  showDataManagerPiP: Ref<boolean>;
  showChatPiP: Ref<boolean>;
  showActivityPiP: Ref<boolean>;
  setShowCreateVOI: (value: boolean) => void;
  setShowCreateAOI: (value: boolean) => void;
  setShowDataManagerPiP: (value: boolean) => void;
  setShowChatPiP: (value: boolean) => void;
  setShowActivityPiP: (value: boolean) => void;
}

function useUiPanels(): UiPanels {
  const showCreateVOI = ref(false);
  const showCreateAOI = ref(false);
  const showDataManagerPiP = ref(false);
  const showChatPiP = ref(false);
  const showActivityPiP = ref(false);

  function setShowCreateVOI(value: boolean): void {
    showCreateVOI.value = value;
  }

  function setShowCreateAOI(value: boolean): void {
    showCreateAOI.value = value;
  }

  function setShowDataManagerPiP(value: boolean): void {
    showDataManagerPiP.value = value;
  }

  function setShowChatPiP(value: boolean): void {
    showChatPiP.value = value;
  }

  function setShowActivityPiP(value: boolean): void {
    showActivityPiP.value = value;
  }

  return {
    showCreateVOI,
    showCreateAOI,
    showDataManagerPiP,
    showChatPiP,
    showActivityPiP,
    setShowCreateVOI,
    setShowCreateAOI,
    setShowDataManagerPiP,
    setShowChatPiP,
    setShowActivityPiP,
  };
}

export { useUiOverlays, useUiPanels };
