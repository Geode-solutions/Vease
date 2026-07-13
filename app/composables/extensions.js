import Bowser from "bowser";
import { compareVersions } from "compare-versions";
import { uploadExtension } from "@ogw_front/utils/extension";
import { useAppStore } from "@ogw_front/stores/app";

import { useAPIStore } from "@vease/stores/api";
import { useAuth } from "./auth";
import { useExtensionMetadata } from "@vease/composables/extension_metadata";

function getUserPlatform() {
  const parser = Bowser.getParser(navigator.userAgent);
  const os = parser.getOS();
  const name = os.name?.toLowerCase() || "";
  if (name.includes("windows")) {
    return "win32";
  }
  if (name.includes("linux")) {
    return "linux";
  }
  return "unknown";
}

// oxlint-disable-next-line max-lines-per-function
export function useExtensions() {
  const { user } = useAuth();
  const APIStore = useAPIStore();
  const { getExtensionVersion } = useExtensionMetadata();

  async function allowedExtensions() {
    console.log("[Extensions] Checking user...", user.value);
    if (!user.value) {
      console.log("[Extensions] No user");
      return [];
    }
    const token = await user.value.getIdToken();
    console.log("[Extensions] Token:", token);
    const schema = {
      $id: "/extensions/list",
      methods: ["GET"],
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    };
    console.log({ schema });
    const headers = { Authorization: `Bearer ${token}` };
    console.log({ headers });
    console.log({ APIStore });
    return APIStore.request({ schema, headers });
  }

  async function downloadExtension(extensionId) {
    if (!user.value) {
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
    const { url } = await APIStore.request({ schema, params, headers });
    console.log({ url });
    const fileBuffer = await fetch(url).then((file) => file.arrayBuffer());
    return new File([fileBuffer], `${extensionId}-${platform}.vext`);
  }

  async function updateExtensions() {
    console.log("[Extensions] Updating extensions...");
    if (process.env.NODE_ENV === "development") {
      console.log("[Extensions] Skipping extension update in development mode");
      return;
    }
    const appStore = useAppStore();
    const loadedExtensions = appStore.getLoadedExtensions();
    const extensions = await allowedExtensions();

    console.log("[Extensions] Allowed extensions:", extensions);
    const extensionsFilesToDownload = [];
    for (const loadedExtension of loadedExtensions) {
      const matchingExtension = extensions.find((extension) => extension.id === loadedExtension.id);
      const latestVersion = matchingExtension.version;
      console.log(`[Extensions] Latest version of ${loadedExtension.id}: ${latestVersion}`);
      const currentVersion = getExtensionVersion(loadedExtension);
      console.log(`[Extensions] Current version of ${loadedExtension.id}: ${currentVersion}`);
      if (compareVersions(latestVersion, currentVersion, ">")) {
        extensionsFilesToDownload.push(downloadExtension(loadedExtension.id));
      }
    }
    await Promise.all(
      extensionsFilesToDownload.map(async (extensionFilePromise) => {
        const extensionFile = await extensionFilePromise;
        await uploadExtension(extensionFile);
      }),
    );
  }
  return {
    allowedExtensions,
    downloadExtension,
    updateExtensions,
  };
}
