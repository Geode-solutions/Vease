import { useAuth } from "./auth";

export function useExtensions() {
  const { user } = useAuth();

  async function allowedExtensions() {
    console.log("[Extensions] Checking user...", user.value);
    if (!user.value) {
      return [];
    }
    const token = await user.value.getIdToken();
    console.log("[Extensions] Fetched token, calling API...");
    try {
      const res = await $fetch("/extensions/list", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        baseURL: "https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api",
      });
      console.log("[Extensions] API Response:", res);
      return res;
    } catch (error) {
      console.error("[Extensions] API Error:", error);
      throw error;
    }
  }

  async function downloadExtension(extensionId) {
    if (!user.value) {
      throw new Error("User not authenticated");
    }
    const token = await user.value.getIdToken();
    const response = await fetch(`https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api/extensions/${extensionId}/download`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download extension ${extensionId}`);
    }
    
    const blob = await response.blob();
    return new File([blob], `${extensionId}.vext`);
  }

  return {
    allowedExtensions,
    downloadExtension,
  };
}
