import Bowser from "bowser";
import { useAPIStore } from "@vease/stores/api";
import { useAuth } from "./auth";

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
  const { isUserAuthenticated } = useAuth();
  const APIStore = useAPIStore();

  async function allowedExtensions() {
    if (!isUserAuthenticated.value) {
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
    if (!isUserAuthenticated.value) {
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
    const params = { extension: extensionId, platform: getUserPlatform() };
    const headers = { Authorization: `Bearer ${token}` };
    const { url } = await APIStore.request({ schema, params, headers });
    console.log({ url });
    const fileBuffer = await fetch(url).then((file) => file.arrayBuffer());
    return new File([fileBuffer], `${extensionId}.vext`);
  }

  return {
    allowedExtensions,
    downloadExtension,
  };
}
