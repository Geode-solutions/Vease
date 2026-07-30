// Third party imports
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { fetchSchema } from "@ogw_shared/utils/fetch_schema";
import { fetchRaw } from "@ogw_shared/utils/fetch_raw";

// Local imports
import { getBackBaseUrl } from "./config.js";

async function getAllowedFileExtensions() {
  const backBaseUrl = await getBackBaseUrl();
  console.log("getAllowedFileExtensions", { backBaseUrl });
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
  console.log("getAllowedGeodeObjectTypes", { backBaseUrl });
  const schema = back_schemas.opengeodeweb_back.allowed_objects;
  const params = { filename };
  return fetchSchema({
    schema,
    params,
    baseURL: backBaseUrl
  }, {
    onResponse: (response) => {
      const allowedGeodeObjectTypes = Object.keys(response.allowed_objects);
      console.log(`Allowed geode object types: ${allowedGeodeObjectTypes}`);
      return allowedGeodeObjectTypes[0];
    }
  })
}

async function uploadFile(file) {
  const backBaseUrl = await getBackBaseUrl();
  console.log("uploadFile", { backBaseUrl });
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
  console.log("saveViewableFile", { backBaseUrl });
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