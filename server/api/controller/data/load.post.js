// Node imports

// Third party imports
import { createError, defineEventHandler, readMultipartFormData } from "h3";
import { useRuntimeConfig } from "#imports";

// Local imports

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event)
    console.log(`Config: ${JSON.stringify(config)}`)
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: 'No form data received' })
    }

    // formData is an array of parts, each with: name, filename, type, data (Buffer)
    const filePart = formData.find(part => part.name === 'file')
    const backPort = formData.find(part => part.name === 'backPort')
    const viewerPort = formData.find(part => part.name === 'viewerPort')


    if (!filePart) {
      throw createError({ statusCode: 400, statusMessage: 'No file field found' })
    }

    const content = filePart.data.toString('utf-8') // or keep as Buffer for binary
    console.log(`Received file: ${filePart.filename}, type: ${filePart.type}, size: ${filePart.data.length} bytes`)
    const filename = filePart.filename
    console.log(`Received file: ${filename}`)
    // console.log(`Received file content: ${content}`)

    const mimeType = filePart.type

    async function uploadFile() {
      const formData = new FormData()
      formData.append('file', new Blob([filePart.data], { type: filePart.type }), filePart.filename)


      const request_options = {
        method: "PUT",
        body: formData,
      };
      return fetch(`http://localhost:${backPort.data.toString('utf-8')}/opengeodeweb_back/upload_file`, {
        ...request_options
      });

    }
    async function saveViewableFile() {
      const body = {
        filename,
        geode_object_type: "BRep"
      };
      const request_options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Accept": "text/event-stream" },
      }

      return fetch(`http://localhost:${backPort.data.toString('utf-8')}/opengeodeweb_back/save_viewable_file`, {
        ...request_options
      });

    }

    await uploadFile();
    await saveViewableFile();

    return { statusCode: 200, filename, mimeType, size: filePart.data.length }
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
