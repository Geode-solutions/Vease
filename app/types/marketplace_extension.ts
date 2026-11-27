import type { Description } from "@ogw_front/types/ui";
import type { ExtensionId } from "@ogw_front/types/identifiers";
import type { PackageVersion } from "@ogw_front/types/server";

export interface MarketplaceExtension {
  id: ExtensionId;
  description?: Description;
  version?: PackageVersion;
  readme?: string;
  [key: string]: unknown;
}
