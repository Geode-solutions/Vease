import { errors as formidableErrors } from "formidable"
//oxlint-disable-next-line id-length
import fs from "node:fs"
import path from "node:path"
import { readFiles } from "h3-formidable"

const MEGABYTE = 1_048_576 // 1MB
const MAX_FILE_SIZE = 5_242_880 // 5MB
const MAX_FILES = 1
const RANDOM_COEFFICIENT = 10_000_000

export default defineEventHandler(async (event) => {
  try {
    const { files } = await readFiles(event, {
      maxFiles: MAX_FILES,
      maxFileSize: MAX_FILE_SIZE,
    })

    if (!Object.keys(files).length) {
      throw createError({
        statusMessage: "2001",
        statusCode: 400,
      })
    }

    for (let index = 0; index < Object.keys(files).length; index += 1) {
      const [{ filepath, mimetype }] = files[index]

      if (!mimetype.startsWith("image")) {
        throw createError({
          statusMessage: "2002",
          statusCode: 400,
        })
      }

      let imageName = `${String(Date.now()) + String(Math.round(Math.random() * RANDOM_COEFFICIENT))}.${mimetype.split("/")[1]}`
      let newPath = path.join("upload", imageName)
      fs.copyFileSync(filepath, newPath)
    }

    return {
      status: 200,
      message: "Upload image successfully.",
    }
  } catch (error) {
    if (error.message === "2001") {
      throw createError({
        statusMessage: "File is required.",
        statusCode: 400,
      })
    }

    if (error.message === "2002") {
      throw createError({
        statusMessage: "Only image allowed.",
        statusCode: 400,
      })
    }

    if (error.code === formidableErrors.maxFilesExceeded) {
      throw createError({
        statusMessage: `Can't upload more than ${maxFiles} image.`,
        statusCode: 400,
      })
    }

    if (error.code === formidableErrors.biggerThanTotalMaxFileSize) {
      throw createError({
        statusMessage: `File is larger than ${fileSize / MEGABYTE} MB.`,
        statusCode: 400,
      })
    }

    throw createError({
      statusMessage: "An unknown error occurred",
      statusCode: 500,
    })
  }
})
