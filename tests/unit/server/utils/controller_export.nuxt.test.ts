import { LONG_COMMAND_TIMEOUT_MS, dispatchCommand } from "@vease_server/utils/command_bus";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { expectUpload, hasUpload } from "@vease_server/utils/file_transfer";
import { exportToFile } from "@vease_server/utils/controller_export";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/command_bus"), async (importOriginal) => ({
  ...(await importOriginal()),
  dispatchCommand: vi.fn<(command: string, params: unknown) => Promise<never>>(),
}));

vi.mock(import("@vease_server/utils/file_transfer"), async (importOriginal) => ({
  ...(await importOriginal()),
  expectUpload: vi.fn<typeof expectUpload>(),
}));

const BAD_REQUEST = 400;
const TOKEN = "upload-token";
const REPORT_FORMATS = { label: "report", formats: ["txt", "csv"], expected: ".txt or .csv" };

describe("exportToFile()", () => {
  let directory = "";

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.mocked(expectUpload).mockReturnValue(TOKEN);
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "vease-export-"));
  });

  afterEach(async () => {
    await fs.rm(directory, { recursive: true, force: true });
  });

  test("dispatches the command with the format, an upload url and a long timeout", async () => {
    const filePath = path.join(directory, "report.csv");
    vi.mocked(dispatchCommand).mockResolvedValue({});

    await exportToFile(filePath, REPORT_FORMATS, "export-report", { verbose: true });

    expect(expectUpload).toHaveBeenCalledWith(filePath);
    expect(dispatchCommand).toHaveBeenCalledWith(
      "export-report",
      { verbose: true, format: "csv", uploadUrl: `/api/controller/files/upload?token=${TOKEN}` },
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  });

  test("reads the format from the extension case-insensitively", async () => {
    vi.mocked(dispatchCommand).mockResolvedValue({});

    await exportToFile(path.join(directory, "REPORT.TXT"), REPORT_FORMATS, "export-report", {});

    expect(dispatchCommand).toHaveBeenCalledWith(
      "export-report",
      expect.objectContaining({ format: "txt" }),
      { timeout: LONG_COMMAND_TIMEOUT_MS },
    );
  });

  test("cancels the upload token and rethrows when the export fails", async () => {
    const actual = await vi.importActual<{ expectUpload: typeof expectUpload }>(
      "@vease_server/utils/file_transfer",
    );
    const filePath = path.join(directory, "report.txt");
    const token = actual.expectUpload(filePath);
    vi.mocked(expectUpload).mockReturnValue(token);
    vi.mocked(dispatchCommand).mockRejectedValue(new Error("Vease did not answer in time"));
    expect(hasUpload(token)).toBe(true);

    await expect(exportToFile(filePath, REPORT_FORMATS, "export-report", {})).rejects.toThrow(
      "Vease did not answer in time",
    );
    expect(hasUpload(token)).toBe(false);
  });

  test("rejects an extension outside the formats", async () => {
    await expect(
      exportToFile(path.join(directory, "report.pdf"), REPORT_FORMATS, "export-report", {}),
    ).rejects.toMatchObject({
      statusCode: BAD_REQUEST,
      message: "A report must be exported to a .txt or .csv file",
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a path without an extension", async () => {
    await expect(
      exportToFile(path.join(directory, "report"), REPORT_FORMATS, "export-report", {}),
    ).rejects.toMatchObject({ statusCode: BAD_REQUEST });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a relative path", async () => {
    await expect(
      exportToFile("reports/report.txt", REPORT_FORMATS, "export-report", {}),
    ).rejects.toMatchObject({
      statusCode: BAD_REQUEST,
      message: "reports/report.txt is not an absolute path",
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a missing parent directory", async () => {
    const missing = path.join(directory, "missing");

    await expect(
      exportToFile(path.join(missing, "report.txt"), REPORT_FORMATS, "export-report", {}),
    ).rejects.toMatchObject({
      statusCode: BAD_REQUEST,
      message: `The directory ${missing} does not exist`,
    });
    expect(expectUpload).not.toHaveBeenCalled();
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects a parent that is a file", async () => {
    const parent = path.join(directory, "notes.txt");
    await fs.writeFile(parent, "notes");

    await expect(
      exportToFile(path.join(parent, "report.txt"), REPORT_FORMATS, "export-report", {}),
    ).rejects.toMatchObject({
      statusCode: BAD_REQUEST,
      message: `The directory ${parent} does not exist`,
    });
    expect(dispatchCommand).not.toHaveBeenCalled();
  });

  test("rejects an existing file and leaves it untouched", async () => {
    const filePath = path.join(directory, "report.txt");
    await fs.writeFile(filePath, "existing");

    await expect(exportToFile(filePath, REPORT_FORMATS, "export-report", {})).rejects.toMatchObject(
      {
        statusCode: BAD_REQUEST,
        message: `${filePath} already exists; choose another path`,
      },
    );
    expect(expectUpload).not.toHaveBeenCalled();
    expect(dispatchCommand).not.toHaveBeenCalled();
    await expect(fs.readFile(filePath, "utf8")).resolves.toBe("existing");
  });

  test("rejects a dangling symlink at the path", async () => {
    const filePath = path.join(directory, "report.txt");
    await fs.symlink(path.join(directory, "nowhere.txt"), filePath);

    await expect(exportToFile(filePath, REPORT_FORMATS, "export-report", {})).rejects.toMatchObject(
      {
        statusCode: BAD_REQUEST,
        message: `${filePath} already exists; choose another path`,
      },
    );
    expect(dispatchCommand).not.toHaveBeenCalled();
  });
});
