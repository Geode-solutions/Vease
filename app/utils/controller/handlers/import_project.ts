// Third party imports
import { importProject } from "@ogw_front/composables/project_manager";

// Local imports
import type { FileName, Url } from "@ogw_front/types/files";
import { appServerUrl } from "@vease/utils/app_server_url";

interface ImportProjectParams {
  downloadUrl: Url;
  filename: FileName;
}

async function importProjectFile(params: unknown): Promise<Record<string, never>> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are built by the load route
  const { downloadUrl, filename } = params as ImportProjectParams;
  const blob = await $fetch<Blob>(appServerUrl(downloadUrl), { responseType: "blob" });
  await importProject(new File([blob], filename));
  return {};
}

export { importProjectFile };
