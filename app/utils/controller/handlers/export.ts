// Third party imports
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_typed_schemas.js";
import { fetchRaw } from "@ogw_shared/utils/fetch_raw";
import { useAppStore } from "@ogw_front/stores/app";
import { useViewerStore } from "@ogw_front/stores/viewer";
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_typed_schemas.js";

// Local imports
import { ControllerError } from "@vease/utils/controller/errors";
import { getBackStore } from "@vease/utils/external_stores";

type ScreenshotFormat = "png" | "jpg";

type ExportParams = { uploadUrl: string } & (
  | { kind: "screenshot"; format: ScreenshotFormat; includeBackground?: boolean }
  | { kind: "project"; format: "vease" }
);

const SCREENSHOT_FILENAME = "controller_screenshot";
const PROJECT_FILENAME = "project.vease";

async function screenshotBlob(format: ScreenshotFormat, includeBackground = true): Promise<Blob> {
  const { blob } = await useViewerStore().request({
    schema: viewer_schemas.opengeodeweb_viewer.viewer.take_screenshot,
    params: {
      filename: SCREENSHOT_FILENAME,
      output_extension: format,
      include_background: format === "jpg" ? true : includeBackground,
    },
  });
  // `blob` is a wslink attachment received as a Blob, typed as the key string the viewer sends
  return new Blob([blob]);
}

function isFileDownloadData(
  value: unknown,
): value is string | ArrayBuffer | ArrayBufferView<ArrayBuffer> | Blob {
  return (
    typeof value === "string" ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    value instanceof Blob
  );
}

async function projectBlob(): Promise<Blob> {
  const snapshot = await useAppStore().exportStores();
  const schema = back_schemas.opengeodeweb_back.export_project;
  const result = await fetchRaw({
    route: schema.$id,
    params: { snapshot, filename: PROJECT_FILENAME },
    method: schema.methods[0],
    baseURL: getBackStore().base_url,
  });
  if (!isFileDownloadData(result)) {
    throw new ControllerError("Unexpected export_project response type");
  }
  return new Blob([result]);
}

async function exportFile(params: unknown): Promise<Record<string, never>> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are validated by the route schema
  const exportParams = params as ExportParams;
  const blob =
    exportParams.kind === "screenshot"
      ? await screenshotBlob(exportParams.format, exportParams.includeBackground)
      : await projectBlob();
  await $fetch(exportParams.uploadUrl, { method: "POST", body: blob });
  return {};
}

export { exportFile };
