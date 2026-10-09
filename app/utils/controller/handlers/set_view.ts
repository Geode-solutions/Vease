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
import { ControllerError } from "@vease/utils/controller/errors";
import { applyScene } from "@vease/utils/controller/handlers/set_view_scene";
import { getDataItem } from "@vease/utils/controller/targets";
import { getHybridViewerStore } from "@vease/utils/external_stores";

type ViewAction = "reset" | "focus" | "orient" | "save" | "restore" | "scene";

interface SetViewParams {
  action: ViewAction;
  id?: string;
  componentIds?: string[];
  orientation?: string;
  name?: string;
  positionId?: number;
  zScaling?: number;
  backgroundColor?: string;
  axes?: boolean;
  grid?: boolean;
}

type Applied = Record<string, unknown>;
type ViewActionHandler = (params: SetViewParams) => Applied | Promise<Applied>;

function need<Value>(action: ViewAction, field: string, value: Value | undefined): Value {
  if (value === undefined) {
    throw new ControllerError(`${action} needs ${field}`);
  }
  return value;
}

function reset(): Applied {
  getHybridViewerStore().resetCamera();
  return {};
}

async function focus(params: SetViewParams): Promise<Applied> {
  const id = need(params.action, "id", params.id);
  const item = await getDataItem(id);
  if (params.componentIds !== undefined && item.viewer_type !== "model") {
    throw new ControllerError("componentIds only applies to models");
  }
  const blockIds =
    params.componentIds === undefined
      ? []
      : await useDataStore().getMeshComponentsViewerIds(id, params.componentIds);
  await getHybridViewerStore().focusCameraOnObject(id, blockIds);
  return { id };
}

function orient(params: SetViewParams): Applied {
  const orientation = need(params.action, "orientation", params.orientation);
  getHybridViewerStore().setCameraOrientation(orientation);
  return { orientation };
}

async function save(params: SetViewParams): Promise<Applied> {
  const name = need(params.action, "name", params.name);
  // oxlint-disable-next-line no-unsafe-type-assertion -- camera_options holds a full CameraOptions once the viewer is initialized
  const cameraOptions = toRaw(getHybridViewerStore().camera_options) as unknown as CameraOptions;
  await useCameraManagerStore().saveCameraPosition(name, cameraOptions);
  return { positions: await listCameraPositions() };
}

function describePositions(positions: CameraPositionRecord[]): string {
  return positions.length > 0
    ? positions.map(({ id, name }) => `${id} (${name})`).join(", ")
    : "none saved";
}

async function restore(params: SetViewParams): Promise<Applied> {
  const positionId = need(params.action, "positionId", params.positionId);
  const cameraManagerStore = useCameraManagerStore();
  const position = await cameraManagerStore.getCameraPosition(positionId);
  if (position === undefined) {
    throw new ControllerError(
      `No camera position ${positionId}; saved positions: ${describePositions(await listCameraPositions())}`,
    );
  }
  const hybridViewerStore = getHybridViewerStore();
  // Same fallback as the camera manager list: restore through the viewer when the render window is missing
  // oxlint-disable-next-line typescript/no-unnecessary-condition -- the holder is typed as always present
  if (hybridViewerStore.genericRenderWindow === undefined) {
    await cameraManagerStore.restoreCameraPosition(positionId);
  } else {
    hybridViewerStore.setCamera(position.camera_options);
  }
  return { positionId, name: position.name };
}

async function scene(params: SetViewParams): Promise<Applied> {
  const { zScaling, backgroundColor, axes, grid } = params;
  const applied = await applyScene({ zScaling, backgroundColor, axes, grid });
  return applied;
}

const VIEW_ACTIONS: Record<ViewAction, ViewActionHandler> = {
  reset,
  focus,
  orient,
  save,
  restore,
  scene,
};

async function setView(params: unknown): Promise<Applied> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const view = params as SetViewParams;
  const applied = await VIEW_ACTIONS[view.action](view);
  await getHybridViewerStore().remoteRender();
  return { action: view.action, ...applied };
}

export { setView };
