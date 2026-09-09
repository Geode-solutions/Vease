const VEASE_API_BASE_URL =
  "https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api";

async function authorizeAiRequest({ authorization, provider }) {
  const response = await fetch(`${VEASE_API_BASE_URL}/ai/authorize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify({ provider }),
  });
  const body = await response.json().catch(() => ({}));
  return { authorized: response.ok, status: response.status, body };
}

export { authorizeAiRequest };
