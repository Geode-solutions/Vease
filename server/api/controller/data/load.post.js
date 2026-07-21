// Node imports

// Third party imports
import { createError, defineEventHandler, readMultipartFormData } from "h3";
import { useRuntimeConfig } from "#imports";

// Local imports


async function getAllowedGeodeObjectTypes(filename, backPort) {
  const body = { filename };
  const request_options = {
    method: "POST",
    body: JSON.stringify(body),
  }

  const response = await fetch(`http://localhost:${backPort}/opengeodeweb_back/allowed_objects`, {
    ...request_options
  });
  const allowedGeodeObjectTypes = response.allowed_objects
  if (!allowedGeodeObjectTypes) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to get allowed geode object types' })
  }
  if (allowedGeodeObjectTypes.length > 1) {
    throw createError({ statusCode: 500, statusMessage: 'Data loadable with multiple geode object types' })
  }
  return allowedGeodeObjectTypes[0]
}

function uploadFile(file, backPort) {
  if (!file) { throw createError({ statusCode: 400, statusMessage: 'No file field found' }) }
  const { filename, type, data } = file
  console.log(`Received file: ${filename}, type: ${type}, size: ${data.length} bytes`)
  const formData = new FormData()
  formData.append('file', new Blob([data], { type }), filename)

  const request_options = {
    method: "PUT",
    body: formData,
  };

  return fetch(`http://localhost:${backPort}/opengeodeweb_back/upload_file`, {
    ...request_options
  });
}

function saveViewableFile(filename, geode_object_type, backPort) {
  const body = {
    filename,
    geode_object_type
  };
  const request_options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Accept": "text/event-stream" },
  }

  return fetch(`http://localhost:${backPort}/opengeodeweb_back/save_viewable_file`, {
    ...request_options
  });
}


export default defineEventHandler(
  // oxlint-disable-next-line max-statements, max-lines-per-function
  async (event) => {
    try {
      const config = useRuntimeConfig(event)
      console.log(`Config: ${JSON.stringify(config)}`)
      const formData = await readMultipartFormData(event)

      if (!formData) {
        throw createError({ statusCode: 400, statusMessage: 'No form data received' })
      }

      const filePart = formData.find(part => part.name === 'file')
      const backPort = formData.find(part => part.name === 'backPort').data.toString('utf8')

      await uploadFile(filePart, backPort);
      const allowedGeodeObjectType = await getAllowedGeodeObjectTypes(filename, backPort);
      await saveViewableFile(filename, allowedGeodeObjectType, backPort);

      return { statusCode: 200, filename, mimeType, size: filePart.data.length }
    } catch (error) {
      console.log(error);
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  });
