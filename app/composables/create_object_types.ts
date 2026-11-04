import type { ApiSchema } from "@vease/utils/external_stores";
import type { Point } from "./create_object_points";
import type { ViewerPreviewPointsParams } from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_typed_schemas.js";

interface CreateObjectToolOptions {
  namePrefix: string;
  minPoints: number;
  schema: ApiSchema;
  getAdditionalPayload?: (points: Point[]) => Record<string, unknown>;
  previewStyle?: ViewerPreviewPointsParams["style"];
  previewExtraSources?: unknown[];
  getPreviewParams?: () => Record<string, unknown>;
  onPickedPoint?: (point: Point, points: Point[]) => boolean | undefined;
  onReset?: () => void;
}

interface UseCreateObjectToolReturn {
  name: Ref<string>;
  points: Ref<Point[]>;
  pickingActive: Ref<boolean>;
  loading: Ref<boolean>;
  validPoints: ComputedRef<Point[]>;
  hasValidPoints: ComputedRef<boolean>;
  validPointCount: ComputedRef<number>;
  addPoint: () => void;
  removePoint: (index: number) => void;
  togglePickMode: () => void;
  handleClose: () => void;
  sanitizeInput: (value: unknown, index: number, field: keyof Point) => void;
  handlePaste: (event: ClipboardEvent, index: number, field: keyof Point) => void;
  createObject: () => Promise<void>;
}

export type { CreateObjectToolOptions, UseCreateObjectToolReturn };
