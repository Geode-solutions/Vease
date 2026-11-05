// Third party imports
import type { CameraOptions } from "@ogw_internal/stores/hybrid_viewer/vtk_types.js";
import { toRaw } from "vue";
import { useCameraManagerStore } from "@ogw_front/stores/camera_manager";
import { useDataStore } from "@ogw_front/stores/data";

// Local imports
import {
  type CameraPositionRecord,
  listCameraPositions,
} from "@vease/utils/controller/handlers/viewer_state";
import { getDataItem, resolveComponentIds } from "@vease/utils/controller/targets";
import { ControllerError } from "@vease/utils/controller/errors";
import { applyScene } from "@vease/utils/controller/handlers/set_view_scene";
import { getHybridViewerStore } from "@vease/utils/external_stores";

interface SceneParams {
  zScaling?: number;
  backgroundColor?: string;
  axes?: boolean;
  grid?: boolean;
}

type Applied = Record<string, unknown>;

function reset(): Applied {
  getHybridViewerStore().resetCamera();
  return {};
}

async function focus(params: { id: string; componentIds?: string[] }): Promise<Applied> {
  const { id } = params;
  const item = await getDataItem(id);
  if (params.componentIds !== undefined && item.viewer_type !== "model") {
    throw new ControllerError("componentIds only applies to models");
  }
  let blockIds: number[] = [];
  if (params.componentIds !== undefined) {
    const componentIds = await resolveComponentIds(item, undefined, params.componentIds);
    blockIds = await useDataStore().getMeshComponentsViewerIds(id, componentIds);
  }
  await getHybridViewerStore().focusCameraOnObject(id, blockIds);
  return { id };
}

function orient({ orientation }: { orientation: string }): Applied {
  getHybridViewerStore().setCameraOrientation(orientation);
  return { orientation };
}

async function save({ name }: { name: string }): Promise<Applied> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- camera_options holds a full CameraOptions once the viewer is initialized
  const cameraOptions = toRaw(getHybridViewerStore().camera_options) as unknown as CameraOptions;
  await useCameraManagerStore().saveCameraPosition(name, cameraOptions);
  return { positions: await listCameraPositions() };
}

function describePositions(positions: CameraPositionRecord[]): string {
  if (positions.length === 0) {
    return "none saved";
  }
  return positions.map(({ id, name }) => `${id} (${name})`).join(", ");
}

async function restore({ positionId }: { positionId: number }): Promise<Applied> {
  const cameraManagerStore = useCameraManagerStore();
  const position = await cameraManagerStore.getCameraPosition(positionId);
  if (position === undefined) {
    throw new ControllerError(
      `No camera position ${positionId}; saved positions: ${describePositions(await listCameraPositions())}`,
    );
  }
  const hybridViewerStore = getHybridViewerStore();
  // Same fallback as the camera manager list: restore through the viewer when the render window is missing
  if (hybridViewerStore.genericRenderWindow.value === undefined) {
    await cameraManagerStore.restoreCameraPosition(positionId);
  } else {
    hybridViewerStore.setCamera(position.camera_options);
  }
  return { positionId, name: position.name };
}

async function scene(params: SceneParams): Promise<Applied> {
  const { zScaling, backgroundColor, axes, grid } = params;
  const applied = await applyScene({ zScaling, backgroundColor, axes, grid });
  return applied;
}

// Every view command renders once its change is applied
function viewCommand(
  action: (params: never) => Applied | Promise<Applied>,
): (params: unknown) => Promise<Applied> {
  return async (params) => {
    // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema of the action
    const applied = await action(params as never);
    await getHybridViewerStore().remoteRender();
    return applied;
  };
}

const resetView = viewCommand(reset);
const focusView = viewCommand(focus);
const orientView = viewCommand(orient);
const saveView = viewCommand(save);
const restoreView = viewCommand(restore);
const setScene = viewCommand(scene);

export { focusView, orientView, resetView, restoreView, saveView, setScene };
