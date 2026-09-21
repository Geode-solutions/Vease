import { useUIStore } from "@vease/stores/ui";

interface Extension {
  id?: string;
  metadata?: {
    name?: string;
    description?: string;
    version?: string;
  };
  [key: string]: unknown;
}

function getExtensionName(extension: Extension | null | undefined) {
  if (!extension) {
    return "Unknown Extension";
  }
  if (extension.metadata?.name) {
    return extension.metadata.name;
  }
  return extension.id || "Unknown Extension";
}

function getExtensionDescription(extension: Extension | null | undefined) {
  if (!extension) {
    return "Custom extension module";
  }
  return extension?.metadata?.description || "Custom extension module";
}

function getExtensionVersion(extension: Extension | null | undefined) {
  if (!extension) {
    return undefined;
  }
  return extension?.metadata?.version || undefined;
}

function useExtensionMetadata() {
  const UIStore = useUIStore();

  function getExtensionTools(extension: Extension | null | undefined) {
    if (!extension) {
      return [];
    }
    return UIStore.toolsDefinitions.filter((tool) => tool.extensionPath === extension.id);
  }

  function getExtensionToolsCount(extension: Extension | null | undefined) {
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
