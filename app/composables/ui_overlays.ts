import type { DataItem } from "@vease/types/data_item";

interface UiOverlays {
  showStepper: Ref<boolean>;
  showCreateTools: Ref<boolean>;
  showCrsAlign: Ref<boolean>;
  crsAlignItem: Ref<DataItem | undefined>;
  showExtensions: Ref<boolean>;
  anyOverlayOpen: ComputedRef<boolean>;
  setShowStepper: (value: boolean) => void;
  setShowCreateTools: (value: boolean) => void;
  setShowCrsAlign: (value: boolean) => void;
  setShowExtensions: (value: boolean) => void;
  openCrsAlign: (item: DataItem) => void;
  closeAllDrawers: () => void;
}

function useUiOverlays(): UiOverlays {
  const showStepper = ref(false);
  const showCreateTools = ref(false);
  const showCrsAlign = ref(false);
  const crsAlignItem = ref<DataItem | undefined>(undefined);
  const showExtensions = ref(false);

  const anyOverlayOpen = computed(
    () => showStepper.value || showCreateTools.value || showExtensions.value || showCrsAlign.value,
  );

  function setShowStepper(value: boolean): void {
    showStepper.value = value;
  }

  function setShowCreateTools(value: boolean): void {
    showCreateTools.value = value;
  }

  function setShowCrsAlign(value: boolean): void {
    showCrsAlign.value = value;
  }

  function setShowExtensions(value: boolean): void {
    showExtensions.value = value;
  }

  function openCrsAlign(item: DataItem): void {
    crsAlignItem.value = item;
    showCrsAlign.value = true;
  }

  // The overlays counted by anyOverlayOpen
  function closeAllDrawers(): void {
    showStepper.value = false;
    showCreateTools.value = false;
    showExtensions.value = false;
    showCrsAlign.value = false;
  }

  return {
    showStepper,
    showCreateTools,
    showCrsAlign,
    crsAlignItem,
    showExtensions,
    anyOverlayOpen,
    setShowStepper,
    setShowCreateTools,
    setShowCrsAlign,
    setShowExtensions,
    openCrsAlign,
    closeAllDrawers,
  };
}

interface UiPanels {
  showCreateVOI: Ref<boolean>;
  showCreateAOI: Ref<boolean>;
  showDataManagerPiP: Ref<boolean>;
  showChatPiP: Ref<boolean>;
  setShowCreateVOI: (value: boolean) => void;
  setShowCreateAOI: (value: boolean) => void;
  setShowDataManagerPiP: (value: boolean) => void;
  setShowChatPiP: (value: boolean) => void;
}

function useUiPanels(): UiPanels {
  const showCreateVOI = ref(false);
  const showCreateAOI = ref(false);
  const showDataManagerPiP = ref(false);
  const showChatPiP = ref(false);

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

  return {
    showCreateVOI,
    showCreateAOI,
    showDataManagerPiP,
    showChatPiP,
    setShowCreateVOI,
    setShowCreateAOI,
    setShowDataManagerPiP,
    setShowChatPiP,
  };
}

export { useUiOverlays, useUiPanels };
