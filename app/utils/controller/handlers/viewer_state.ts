// Third party imports
import { getTable } from "@ogw_internal/database/database.js";

// Local imports
import { getHybridViewerStore } from "@vease/utils/external_stores";

interface CameraPositionRecord {
  id?: number;
  name: string;
}

interface ViewerState {
  zScaling: number;
  cameraPositions: CameraPositionRecord[];
  orientations: string[];
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
