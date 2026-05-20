import { useAuth } from "./auth";

export async function useExtensions() {
  const { user } = useAuth();
  console.log({ user });

  if (user) {
    const token = await user.value.getIdToken();
    const data = await $fetch("/extensions/list", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      baseURL: "https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api",
    });
    console.log(data);
  }
}
