import type { CRSList } from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";

export interface DataItem {
  id: string;
  geode_id: string;
  name: string;
  visible: boolean;
  geode_object_type: string;
  viewer_type: string;
  created_at?: string;
  crs?: CRSList;
  [key: string]: unknown;
}
