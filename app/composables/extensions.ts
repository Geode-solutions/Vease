import Bowser from "bowser";
import { compare } from "compare-versions";
import { importExtensionURL } from "@ogw_front/utils/extension";
import { useAppStore } from "@ogw_front/stores/app";

import { useAPIStore } from "@vease/stores/api";
import { useAuth } from "./auth";
import { useExtensionMetadata } from "@vease/composables/extension_metadata";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { Extension } from "@vease/composables/extension_metadata";

interface RemoteExtensionInfo {
  id: string;
  version: string;
}

function isRemoteExtensionInfo(value: unknown): value is RemoteExtensionInfo {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "version" in value &&
    typeof value.version === "string"
  );
}

function isRemoteExtensionInfoArray(value: unknown): value is RemoteExtensionInfo[] {
  return Array.isArray(value) && value.every((item) => isRemoteExtensionInfo(item));
}

interface DownloadExtensionResponse {
  url: string;
}

function isDownloadExtensionResponse(value: unknown): value is DownloadExtensionResponse {
  return (
    typeof value === "object" && value !== null && "url" in value && typeof value.url === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringField(source: Record<string, unknown>, field: string): string | undefined {
  const value = source[field];
  return typeof value === "string" ? value : undefined;
}

function toExtension(loadedExtension: { id: string; metadata: unknown }): Extension {
  const metadata = isRecord(loadedExtension.metadata) ? loadedExtension.metadata : {};
  return {
    id: loadedExtension.id,
    metadata: {
      name: getStringField(metadata, "name"),
      description: getStringField(metadata, "description"),
      version: getStringField(metadata, "version"),
    },
  };
}

function getUserPlatform(): string {
  const parser = Bowser.getParser(navigator.userAgent);
  const os = parser.getOS();
  const name = os.name?.toLowerCase() ?? "";
  if (name.includes("windows")) {
    return "win32";
  }
  if (name.includes("linux")) {
    return "linux";
  }
  return "unknown";
}

interface UseExtensionsReturn {
  allowedExtensions: () => Promise<RemoteExtensionInfo[]>;
  downloadExtension: (extensionId: string) => Promise<{ url: string; extensionFileName: string }>;
  updateExtensions: () => Promise<void>;
}

// oxlint-disable-next-line max-lines-per-function
export function useExtensions(): UseExtensionsReturn {
  const { isUserAuthenticated, user } = useAuth();
  const APIStore = useAPIStore();
  const { getExtensionVersion } = useExtensionMetadata();

  async function allowedExtensions(): Promise<RemoteExtensionInfo[]> {
    if (!isUserAuthenticated.value || !user.value) {
      return [];
    }
    const token = await user.value.getIdToken();
    const schema = {
      $id: "/extensions/list",
      methods: ["GET"],
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    };
    const headers = { Authorization: `Bearer ${token}` };
    const result = await APIStore.request({ schema, headers });
    return isRemoteExtensionInfoArray(result) ? result : [];
  }

  async function downloadExtension(
    extensionId: string,
  ): Promise<{ url: string; extensionFileName: string }> {
    if (!isUserAuthenticated.value || !user.value) {
      throw new Error("User not authenticated");
    }
    const token = await user.value.getIdToken();
    const schema = {
      $id: "/extensions/download",
      methods: ["POST"],
      type: "object",
      properties: { extension: { type: "string" }, platform: { type: "string" } },
      required: ["extension", "platform"],
      additionalProperties: false,
    };
    const platform = getUserPlatform();
    const params = { extension: extensionId, platform };
    const headers = { Authorization: `Bearer ${token}` };
    const result = await APIStore.request({ schema, params, headers });
    if (!isDownloadExtensionResponse(result)) {
      throw new Error("Invalid download extension response");
    }
    const { url } = result;
    console.log({ url });
    const extensionFileName = `${extensionId}-${platform}.vext`;
    return { url, extensionFileName };
  }

  async function updateExtensions(): Promise<void> {
    console.log("[Extensions] Updating extensions...");
    if (process.env.NODE_ENV === "development") {
      console.log("[Extensions] Skipping extension update in development mode");
      return;
    }
    const appStore = useAppStore();
    const loadedExtensions = appStore.getLoadedExtensions();
    const extensions = await allowedExtensions();

    console.log("[Extensions] Allowed extensions:", extensions);
    const extensionsFilesToDownload: ReturnType<typeof downloadExtension>[] = [];
    for (const loadedExtension of loadedExtensions) {
      const matchingExtension = extensions.find((extension) => extension.id === loadedExtension.id);
      if (!matchingExtension) {
        continue;
      }
      const latestVersion = matchingExtension.version;
      console.log(`[Extensions] Latest version of ${loadedExtension.id}: ${latestVersion}`);
      const currentVersion = getExtensionVersion(toExtension(loadedExtension));
      console.log(`[Extensions] Current version of ${loadedExtension.id}: ${currentVersion}`);
      if (
        latestVersion &&
        currentVersion !== undefined &&
        compare(latestVersion, currentVersion, ">")
      ) {
        extensionsFilesToDownload.push(downloadExtension(loadedExtension.id));
      }
    }
    await Promise.all(
      extensionsFilesToDownload.map(async (extensionFilePromise) => {
        const extensionFile = await extensionFilePromise;
        await importExtensionURL(extensionFile);
      }),
    );
  }
  return {
    allowedExtensions,
    downloadExtension,
    updateExtensions,
  };
}
