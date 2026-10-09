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

async function viewerState(): Promise<ViewerState> {
  // The camera manager store only exposes positions as a live query ref, empty until its first emission
  const positions = await getTable<CameraPositionRecord>("camera_positions").toArray();
  return {
    zScaling: getHybridViewerStore().zScale,
    cameraPositions: positions.map(({ id, name }) => ({ id, name })),
    orientations: ORIENTATIONS,
  };
}

export { viewerState };
