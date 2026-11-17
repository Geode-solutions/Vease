type ResponseHeaders = Record<string, string[]>;

const CORS_HEADERS = [
  "Access-Control-Allow-Origin",
  "Access-Control-Allow-Methods",
  "Access-Control-Allow-Headers",
];
const CORS_HEADER_NAMES = new Set(CORS_HEADERS.map((header) => header.toLowerCase()));

// The desktop app answers every response with a single wildcard CORS policy.
// Header names are case-insensitive (HTTP/2 sends them lowercase): every casing
// Of the server's own CORS headers is dropped, otherwise Chromium merges them
// With ours into an invalid multi-valued "http://localhost:1234, *" origin.
function withWildcardCors(headers: ResponseHeaders | undefined): ResponseHeaders {
  const responseHeaders = Object.fromEntries(
    Object.entries(headers ?? {}).filter(([name]) => !CORS_HEADER_NAMES.has(name.toLowerCase())),
  );
  for (const header of CORS_HEADERS) {
    responseHeaders[header] = ["*"];
  }
  return responseHeaders;
}

export { withWildcardCors };
