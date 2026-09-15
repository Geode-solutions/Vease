export interface MarketplaceExtension {
  id: string;
  description?: string;
  version?: string;
  readme?: string;
  [key: string]: unknown;
}
