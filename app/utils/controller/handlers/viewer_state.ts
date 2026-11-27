// Third party imports
import { getTable } from "@ogw_internal/database/database.js";

// Local imports
import type { CameraPositionId, CameraPositionName } from "@ogw_internal/database/types";
import type { CameraOrientationKey } from "@ogw_internal/stores/hybrid_viewer/camera_helpers";
import type { ZScale } from "@ogw_front/types/geometry";
import { getHybridViewerStore } from "@vease/utils/external_stores";

interface CameraPositionRecord {
  id?: CameraPositionId;
  name: CameraPositionName;
}

interface ViewerState {
  zScaling: ZScale;
  cameraPositions: CameraPositionRecord[];
  orientations: CameraOrientationKey[];
}

const ORIENTATIONS = ["xplus", "xminus", "yplus", "yminus", "zplus", "zminus"];

async function listCameraPositions(): Promise<CameraPositionRecord[]> {
  // The camera manager store only exposes positions as a live query ref, empty until its first emission
  const positions = await getTable<CameraPositionRecord>("camera_positions").toArray();
  return positions.map(({ id, name }) => ({ id, name }));
}

async function viewerState(): Promise<ViewerState> {
  return {
    zScaling: getHybridViewerStore().zScale,
    cameraPositions: await listCameraPositions(),
    orientations: ORIENTATIONS,
  };
}

export { listCameraPositions, viewerState };
export type { CameraPositionRecord };
