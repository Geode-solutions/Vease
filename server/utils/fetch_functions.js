// Third party imports
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { fetchRaw } from "@ogw_shared/utils/fetch_raw";
import { fetchSchema } from "@ogw_shared/utils/fetch_schema";

import { resolveAllowedObjects } from "@ogw_shared/utils/response_handlers/load.js";

// Local imports
import { getBackBaseUrl } from "./config.js";

async function getAllowedFileExtensions() {
  const backBaseUrl = await getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.allowed_files;
  const response = await fetchSchema(
    {
      schema,
      baseURL: backBaseUrl
    },
  );
  return response.extensions;
}

async function getAllowedGeodeObjectTypes(filename) {
  const backBaseUrl = await getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.allowed_objects;
  const params = { filename };
  const response = await fetchSchema({
    schema,
    params,
    baseURL: backBaseUrl
  })
  const resolved = resolveAllowedObjects([filename], [response.allowed_objects]);
  if (resolved.selectedGeodeObject) {
    return resolved.selectedGeodeObject
  }
}

async function uploadFile(file) {
  const backBaseUrl = await getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.upload_file;
  const { filename, type, data } = file;
  console.log(`Received file: ${filename}, type: ${type}, size: ${data.length} bytes`);

  const params = new FormData();
  params.append("file", new Blob([data], { type }), filename);
  return fetchRaw(
    {
      route: schema.$id,
      method: schema.methods.find((method) => method !== "OPTIONS"),
      params,
      baseURL: backBaseUrl
    })

}

async function saveViewableFile(filename, geode_object_type) {
  const backBaseUrl = await getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.save_viewable_file;
  const params = { filename, geode_object_type }
  return fetchSchema({
    schema,
    params,
    baseURL: backBaseUrl,
    expectEvent: true,
  })
}


export {
  getAllowedFileExtensions,
  getAllowedGeodeObjectTypes,
  uploadFile,
  saveViewableFile
}