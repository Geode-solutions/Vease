import type {
  DataIdentified,
  GeodeIdentified,
  GeodeObjectTyped,
  ViewerTyped,
} from "@ogw_front/types/identifiers";
import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";

export interface DataItem extends DataIdentified, GeodeIdentified, GeodeObjectTyped, ViewerTyped {
  name: string;
  visible: boolean;
  created_at?: string;
  crs?: CRSList;
  [key: string]: unknown;
}
