import type {
  DataIdentified,
  GeodeIdentified,
  GeodeObjectTyped,
  ViewerObjectTyped,
} from "@ogw_front/types/identifiers";
import type { CRS } from "@geode/opengeodeweb-back/schema_types";

export interface DataItem
  extends DataIdentified, GeodeIdentified, GeodeObjectTyped, ViewerObjectTyped {
  name: string;
  visible: boolean;
  created_at?: string;
  crs?: CRS;
  [key: string]: unknown;
}
