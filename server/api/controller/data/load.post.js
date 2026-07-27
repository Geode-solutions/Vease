// Third party imports
import { createError, defineEventHandler, readMultipartFormData } from "h3";
import { fetchSchema } from "@ogw_shared/utils/fetch_schema";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";

// Local imports
import { getBackBaseUrl } from "@vease_server/utils/config.js";

async function getAllowedGeodeObjectTypes(filename) {
  const backBaseUrl = await getBackBaseUrl();

  const schema = back_schemas.opengeodeweb_back.allowed_objects;
  params = { filename };
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
  const schema = back_schemas.opengeodeweb_back.upload_file;
  const { filename, type, data } = file;
  console.log(`Received file: ${filename}, type: ${type}, size: ${data.length} bytes`);

  const params = new FormData();
  params.append("file", new Blob([data], { type }), filename);
  return fetchSchema({
    schema,
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

export default defineEventHandler(
  async (event) => {
    try {
      const formData = await readMultipartFormData(event);
      const filePart = formData.find((part) => part.name === "file");
      if (!filePart) {
        throw createError({ statusCode: 400, statusMessage: "No file field found" });
      }
      const { filename, type: mimeType } = filePart;

      await uploadFile(filePart);
      const allowedGeodeObjectType = await getAllowedGeodeObjectTypes(filename);
      console.log(`Saving file as ${allowedGeodeObjectType}...`);
      await saveViewableFile(filename, allowedGeodeObjectType);

      return { statusCode: 200, filename, mimeType, size: filePart.data.length };
    } catch (error) {
      console.log(error);
      throw createError({
        statusCode: error.statusCode ?? 500,
        statusMessage: error.statusMessage ?? error.message,
      });
    }
  }
);