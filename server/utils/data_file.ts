// Third party imports
import type { MultiPartData } from "h3";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { fetchRaw } from "@ogw_shared/utils/fetch_raw";
import { fetchSchema } from "@ogw_shared/utils/fetch_schema";
import { getBackBaseUrl } from "@geode/opengeodeweb-front/server/utils/server_config.js";
import { resolveAllowedObjects } from "@ogw_shared/utils/response_handlers/load.js";

// Local imports

async function getAllowedFileExtensions() {
  const backBaseUrl = await getBackBaseUrl();
  console.log(`Fetching allowed file extensions from ${backBaseUrl}`);
  const schema = back_schemas.opengeodeweb_back.allowed_files;
  const response = await fetchSchema({
    schema,
    baseURL: backBaseUrl,
    headers: undefined,
    timeout: undefined,
  });
  return response.extensions;
}

async function getAllowedGeodeObjectTypes(filename: string) {
  const backBaseUrl = await getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.allowed_objects;
  const params = { filename };
  const response = await fetchSchema({
    schema,
    params,
    baseURL: backBaseUrl,
    headers: undefined,
    timeout: undefined,
  });
  const resolved = resolveAllowedObjects([filename], [response.allowed_objects]);
  if (resolved.selectedGeodeObject) {
    return resolved.selectedGeodeObject;
  }
}

async function uploadFile(file: MultiPartData) {
  const backBaseUrl = await getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.upload_file;
  const { filename, type, data } = file;
  console.log(`Received file: ${filename}, type: ${type}, size: ${data.length} bytes`);

  const params = new FormData();
  params.append("file", new Blob([new Uint8Array(data)], { type }), filename);
  return fetchRaw({
    route: schema.$id,
    method: schema.methods.find((method) => method !== "OPTIONS"),
    params,
    baseURL: backBaseUrl,
    headers: undefined,
    max_retry: undefined,
    timeout: undefined,
  });
}

async function saveViewableFile(filename: string, geode_object_type: string) {
  const backBaseUrl = await getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.save_viewable_file;
  const params = { filename, geode_object_type };
  return fetchSchema({
    schema,
    params,
    baseURL: backBaseUrl,
    expectEvent: true,
    headers: undefined,
    timeout: undefined,
  });
}

export { getAllowedFileExtensions, getAllowedGeodeObjectTypes, uploadFile, saveViewableFile };
