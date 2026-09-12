export interface DataItem {
  id: string;
  name: string;
  visible: boolean;
  geode_object_type: string;
  viewer_type: string;
  created_at?: string;
  [key: string]: unknown;
}
