import { useAuth } from "./auth";

export function useExtensions() {
  const { user } = useAuth();

  async function allowedExtensions() {
    if (!user) {
      return [];
    }
    const token = await user.value.getIdToken();
    return $fetch("/extensions/list", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api",
    });
  }

  return {
    allowedExtensions,
  };
}
