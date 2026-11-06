import type { DataIdentified, GeodeIdentified } from "@ogw_front/types/identifiers";
import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";

export interface DataItem extends DataIdentified, GeodeIdentified {
  name: string;
  visible: boolean;
  geode_object_type: string;
  viewer_type: string;
  created_at?: string;
  crs?: CRSList;
  [key: string]: unknown;
}
