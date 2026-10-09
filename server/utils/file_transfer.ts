// Node imports
import fs from "node:fs/promises";

// Third party imports
import { createError } from "h3";

interface StagedDownload {
  data: Buffer;
  filename: string;
  timer: ReturnType<typeof setTimeout>;
}

interface ExpectedUpload {
  filePath: string;
  timer: ReturnType<typeof setTimeout>;
}

const TRANSFER_TOKEN_TTL_MS = 300_000;
const NOT_FOUND = 404;
const CONFLICT = 409;

const downloads = new Map<string, StagedDownload>();
const uploads = new Map<string, ExpectedUpload>();

function expireAfterTtl(
  entries: Map<string, unknown>,
  token: string,
): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    entries.delete(token);
  }, TRANSFER_TOKEN_TTL_MS);
}

function stageDownload(data: Buffer, filename: string): string {
  const token = crypto.randomUUID();
  downloads.set(token, { data, filename, timer: expireAfterTtl(downloads, token) });
  return token;
}

function takeDownload(token: string): { data: Buffer; filename: string } | undefined {
  const download = downloads.get(token);
  if (download === undefined) {
    return undefined;
  }
  clearTimeout(download.timer);
  downloads.delete(token);
  return { data: download.data, filename: download.filename };
}

function expectUpload(filePath: string): string {
  const token = crypto.randomUUID();
  uploads.set(token, { filePath, timer: expireAfterTtl(uploads, token) });
  return token;
}

function hasUpload(token: string): boolean {
  return uploads.has(token);
}

function cancelUpload(token: string): void {
  const upload = uploads.get(token);
  if (upload !== undefined) {
    clearTimeout(upload.timer);
    uploads.delete(token);
  }
}

function isAlreadyExistsError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "EEXIST";
}

async function completeUpload(token: string, data: Buffer): Promise<void> {
  const upload = uploads.get(token);
  if (upload === undefined) {
    throw createError({
      statusCode: NOT_FOUND,
      statusMessage: "Not Found",
      message: "Unknown, expired or already used upload token",
    });
  }
  cancelUpload(token);
  const { filePath } = upload;
  try {
    // "wx" fails if the file appeared since the export was requested, so nothing is ever overwritten
    await fs.writeFile(filePath, data, { flag: "wx" });
  } catch (error) {
    if (isAlreadyExistsError(error)) {
      throw createError({
        statusCode: CONFLICT,
        statusMessage: "Conflict",
        message: `${filePath} already exists; choose another path`,
      });
    }
    // Without EEXIST the file did not exist before, so a partial file can only be ours
    await fs.rm(filePath, { force: true });
    throw error;
  }
}

export {
  TRANSFER_TOKEN_TTL_MS,
  cancelUpload,
  completeUpload,
  expectUpload,
  hasUpload,
  stageDownload,
  takeDownload,
};
