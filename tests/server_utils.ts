import { type H3Event, createEvent } from "h3";
import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";

interface MockEventOptions {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  rawBody?: Buffer | string;
}

// Real Node http.IncomingMessage/ServerResponse instances (rather than a
// Duck-typed object) so h3's H3Event can be constructed without any type
// Assertion. readBody/readMultipartFormData/readRawBody all check
// `event._requestBody` first, so the body is attached there directly
// Instead of simulating a readable request stream.
function createMockEvent({
  method = "GET",
  url = "/",
  headers = {},
  rawBody,
}: MockEventOptions = {}): H3Event {
  const req = new IncomingMessage(new Socket());
  req.method = method;
  req.url = url;
  req.headers = headers;
  const res = new ServerResponse(req);

  const event = createEvent(req, res);
  if (rawBody !== undefined) {
    // H3Event's own public field name; bracket access avoids no-underscore-dangle.
    event["_requestBody"] = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody);
  }
  return event;
}

// Mirrors @nuxtjs/mcp-toolkit/server's defineMcpTool: real usage wraps a
// Definition in schema/handler validation, but tests only need it passed
// Through unchanged.
function identityMcpToolDefinition<TDefinition>(definition: TDefinition): TDefinition {
  return definition;
}

function eventWithBody(body: unknown): H3Event {
  return createMockEvent({
    method: "POST",
    headers: { "content-type": "application/json" },
    rawBody: JSON.stringify(body),
  });
}

interface MultipartPart {
  name: string;
  filename?: string;
  contentType?: string;
  data: string;
}

const MULTIPART_BOUNDARY = "----vease-test-boundary";

function buildMultipartBody(parts: MultipartPart[]): { contentType: string; body: Buffer } {
  const segments = parts.map((part) => {
    const filenamePart = part.filename === undefined ? "" : `; filename="${part.filename}"`;
    const contentTypeLine =
      part.contentType === undefined ? "" : `Content-Type: ${part.contentType}\r\n`;
    return (
      `--${MULTIPART_BOUNDARY}\r\n` +
      `Content-Disposition: form-data; name="${part.name}"${filenamePart}\r\n` +
      `${contentTypeLine}\r\n` +
      `${part.data}\r\n`
    );
  });
  const body = Buffer.from(`${segments.join("")}--${MULTIPART_BOUNDARY}--\r\n`);
  return { contentType: `multipart/form-data; boundary=${MULTIPART_BOUNDARY}`, body };
}

// "ok" matches callControllerApi's real 2-letter field name.
function okResult<TPayload>(payload: TPayload): { ok: true; payload: TPayload } {
  return { ok: true, payload };
}

function errResult(message: string): { ok: false; message: string } {
  return { ok: false, message };
}

export {
  createMockEvent,
  eventWithBody,
  identityMcpToolDefinition,
  buildMultipartBody,
  okResult,
  errResult,
};
