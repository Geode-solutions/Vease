import { type H3Event, createEvent } from "h3";
import { IncomingMessage, ServerResponse } from "node:http";
import type { McpRequestExtra } from "@nuxtjs/mcp-toolkit/server";
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
    const buffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody);
    // H3Event's own public field name; bracket access avoids no-underscore-dangle.
    // The project's tsconfig includes both "dom" and "webworker" libs, which
    // Conflict and leave BodyInit unusable for a genuine Buffer assignment here.
    // oxlint-disable-next-line dot-notation no-unsafe-type-assertion -- bracket access avoids no-underscore-dangle; BodyInit is unusable due to dom/webworker lib conflict in tsconfig (not ours to fix), Buffer is a valid runtime BodyInit value.
    event["_requestBody"] = buffer as unknown as BodyInit;
  }
  return event;
}

// Mirrors @nuxtjs/mcp-toolkit/server's defineMcpTool: real usage wraps a
// Definition in schema/handler validation, but tests only need it passed
// Through unchanged.
function identityMcpToolDefinition<TDefinition>(definition: TDefinition): TDefinition {
  return definition;
}

// MCP tool/prompt/resource handlers take a second `extra` argument (abort
// Signal, auth info, session ID, request metadata) from the MCP SDK. None of
// This codebase's handlers read it, so tests only need a stand-in value that
// Satisfies the parameter, not a real McpRequestExtra.
function fakeMcpRequestExtra(): McpRequestExtra {
  // oxlint-disable-next-line no-unsafe-type-assertion -- MCP SDK's RequestHandlerExtra has many fields no handler in this codebase reads; only a minimal stand-in is needed
  return {} as unknown as McpRequestExtra;
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

// "ok" matches callControllerApi's real 2-letter field name. The shared
// Oxlint config (Geode-solutions/actions) doesn't allow customizing
// Id-length's exceptions list, so there's no code-level fix here.
/* oxlint-disable eslint/id-length */
function okResult<TPayload>(payload: TPayload): { ok: true; payload: TPayload } {
  return { ok: true, payload };
}

function errResult(message: string): { ok: false; message: string } {
  return { ok: false, message };
}
/* oxlint-enable eslint/id-length */

export {
  createMockEvent,
  eventWithBody,
  identityMcpToolDefinition,
  fakeMcpRequestExtra,
  buildMultipartBody,
  okResult,
  errResult,
};
