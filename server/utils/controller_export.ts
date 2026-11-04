// Node imports
import fs from "node:fs/promises";
import path from "node:path";

// Third party imports
import { createError } from "h3";

// Local imports
import { LONG_COMMAND_TIMEOUT_MS, dispatchCommand } from "@vease_server/utils/command_bus";
import { cancelUpload, expectUpload } from "@vease_server/utils/file_transfer";

const BAD_REQUEST = 400;
const UPLOAD_URL = "/api/controller/files/upload";

interface ExportFormats {
  // What is exported, as said in the errors
  label: string;
  formats: string[];
  expected: string;
}

function badRequest(message: string): Error {
  return createError({ statusCode: BAD_REQUEST, statusMessage: "Bad Request", message });
}

function exportFormat({ label, formats, expected }: ExportFormats, filePath: string): string {
  const format = path.extname(filePath).slice(1).toLowerCase();
  if (!formats.includes(format)) {
    throw badRequest(`A ${label} must be exported to a ${expected} file`);
  }
  return format;
}

async function isDirectory(directory: string): Promise<boolean> {
  try {
    const stats = await fs.stat(directory);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.lstat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function checkTarget(filePath: string): Promise<void> {
  if (!path.isAbsolute(filePath)) {
    throw badRequest(`${filePath} is not an absolute path`);
  }
  const directory = path.dirname(filePath);
  if (!(await isDirectory(directory))) {
    throw badRequest(`The directory ${directory} does not exist`);
  }
  if (await exists(filePath)) {
    throw badRequest(`${filePath} already exists; choose another path`);
  }
}

// The browser builds the file and uploads it back to the server, which writes it at filePath
async function exportToFile(
  filePath: string,
  formats: ExportFormats,
  command: string,
  params: Record<string, unknown>,
): Promise<void> {
  const format = exportFormat(formats, filePath);
  await checkTarget(filePath);
  const token = expectUpload(filePath);
  try {
    await dispatchCommand(
      command,
      { ...params, format, uploadUrl: `${UPLOAD_URL}?token=${token}` },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  } catch (error) {
    // A late upload after a failed or timed out export must not create the file anyway
    cancelUpload(token);
    throw error;
  }
}

export { exportToFile };
