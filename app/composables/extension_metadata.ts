import { useUIStore } from "@vease/stores/ui";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { ToolDefinition } from "@vease/stores/ui";

interface Extension {
  id?: string;
  metadata?: {
    name?: string;
    description?: string;
    version?: string;
  };
  [key: string]: unknown;
}

function getExtensionName(extension: Extension | null | undefined): string {
  if (!extension) {
    return "Unknown Extension";
  }
  const name = extension.metadata?.name;
  if (name !== undefined && name !== "") {
    return name;
  }
  return extension.id !== undefined && extension.id !== "" ? extension.id : "Unknown Extension";
}

function getExtensionDescription(extension: Extension | null | undefined): string {
  if (!extension) {
    return "Custom extension module";
  }
  const description = extension.metadata?.description;
  return description !== undefined && description !== "" ? description : "Custom extension module";
}

function getExtensionVersion(extension: Extension | null | undefined): string | undefined {
  if (!extension) {
    return undefined;
  }
  const version = extension.metadata?.version;
  return version !== undefined && version !== "" ? version : undefined;
}

function useExtensionMetadata(): {
  getExtensionName: typeof getExtensionName;
  getExtensionDescription: typeof getExtensionDescription;
  getExtensionVersion: typeof getExtensionVersion;
  getExtensionTools: (extension: Extension | null | undefined) => ToolDefinition[];
  getExtensionToolsCount: (extension: Extension | null | undefined) => number;
} {
  const UIStore = useUIStore();

  function getExtensionTools(extension: Extension | null | undefined): ToolDefinition[] {
    if (!extension) {
      return [];
    }
    return UIStore.toolsDefinitions.filter((tool) => tool.extensionPath === extension.id);
  }

  function getExtensionToolsCount(extension: Extension | null | undefined): number {
    return getExtensionTools(extension).length;
  }

  return {
    getExtensionName,
    getExtensionDescription,
    getExtensionVersion,
    getExtensionTools,
    getExtensionToolsCount,
  };
}

export type { Extension };
export { useExtensionMetadata };
