import Bowser from "bowser";
import { compare } from "compare-versions";
import { consola } from "consola";
import { importExtensionURL } from "@ogw_front/utils/extension";
import { useAppStore } from "@ogw_front/stores/app";

import type {
  ExtensionDownloadResponse,
  ExtensionInfo,
  ExtensionsListResponse,
} from "@geode/cloud-api/types";
import cloud_api_schemas from "@geode/cloud-api/cloud_api_schemas.json";
import { useAPIStore } from "@ogw_front/stores/api";
import { useAuth } from "./auth";
import { useExtensionMetadata } from "@vease/composables/extension_metadata";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { Extension } from "@vease/composables/extension_metadata";

// The API returns the Firestore extension documents as stored: `version` is not guaranteed.
type RemoteExtensionInfo = ExtensionInfo & { version: string };

function hasVersion(info: ExtensionInfo): info is RemoteExtensionInfo {
  return typeof info.version === "string";
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
    const schema = cloud_api_schemas.cloud_api.extensions.list;
    const headers = { Authorization: `Bearer ${token}` };
    const result = await APIStore.request<ExtensionsListResponse>({ schema, headers });
    return result.every((info) => hasVersion(info)) ? result : [];
  }

  async function downloadExtension(
    extensionId: string,
  ): Promise<{ url: string; extensionFileName: string }> {
    if (!isUserAuthenticated.value || !user.value) {
      throw new Error("User not authenticated");
    }
    const token = await user.value.getIdToken();
    const schema = cloud_api_schemas.cloud_api.extensions.download;
    const platform = getUserPlatform();
    const params = { extension: extensionId, platform };
    const headers = { Authorization: `Bearer ${token}` };
    const { url } = await APIStore.request<ExtensionDownloadResponse>({ schema, params, headers });
    const extensionFileName = `${extensionId}-${platform}.vext`;
    return { url, extensionFileName };
  }

  async function updateExtensions(): Promise<void> {
    consola.info("[Extensions] Updating extensions...");
    if (process.env.NODE_ENV === "development") {
      consola.info("[Extensions] Skipping extension update in development mode");
      return;
    }
    const appStore = useAppStore();
    const loadedExtensions = appStore.getLoadedExtensions();
    const extensions = await allowedExtensions();

    consola.debug("[Extensions] Allowed extensions:", extensions);
    const extensionsFilesToDownload: ReturnType<typeof downloadExtension>[] = [];
    for (const loadedExtension of loadedExtensions) {
      const matchingExtension = extensions.find((extension) => extension.id === loadedExtension.id);
      if (!matchingExtension) {
        continue;
      }
      const latestVersion = matchingExtension.version;
      consola.info(`[Extensions] Latest version of ${loadedExtension.id}: ${latestVersion}`);
      const currentVersion = getExtensionVersion(toExtension(loadedExtension));
      consola.info(`[Extensions] Current version of ${loadedExtension.id}: ${currentVersion}`);
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
