import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import os from "os";

export default defineEventHandler(async (event) => {
  const maxFiles = 1;
  const fileSize = 1024 * 1024 * 5; // 5MB

  try {
    const projectUuid = uuidv4();
    
    const projectPath = path.join(os.tmpdir(), "vease", projectUuid);
    const uploadPath = path.join(projectPath, "uploads");
    
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const { files } = await readFiles(event, {
      maxFiles: maxFiles,
      maxFileSize: fileSize,
    });

    if (!Object.keys(files).length) {
      throw createError({
        statusMessage: "2001",
        statusCode: 400,
      }); 
    }
    
    const uploadedFiles = [];
    
    for (let index = 0; index < Object.keys(files).length; index++) {
      const filepath = files[index][0].filepath;
      const mimetype = files[index][0].mimetype;

      if (!mimetype.startsWith("image")) {
        throw createError({
          statusMessage: "2002",
          statusCode: 400,
        }); 
      }
      
      let imageName = `${String(Date.now()) + String(Math.round(Math.random() * 10000000))}.${mimetype.split("/")[1]}`;
      let newPath = path.join(uploadPath, imageName);
      fs.copyFileSync(filepath, newPath);
      
      uploadedFiles.push({
        filename: imageName,
        path: newPath,
        projectUuid: projectUuid
      });
    }

    return {
      status: 200,
      message: "Upload image successfully.",
      projectUuid: projectUuid,
      files: uploadedFiles
    };
  } catch (error) {
    if (error.message === "2001") {
      throw createError({
        statusMessage: "File is required.",
        statusCode: 400,
      });
    }

    if (error.message === "2002") {
      throw createError({
        statusMessage: "Only image allowed.",
        statusCode: 400,
      });
    }

    if (error.code === formidableErrors.maxFilesExceeded) {
      throw createError({
        statusMessage: `Can't upload more than ${maxFiles} image.`,
        statusCode: 400,
      });
    }

    if (error.code === formidableErrors.biggerThanTotalMaxFileSize) {
      throw createError({
        statusMessage: `File is larger than ${(fileSize / (1024 * 1024))} MB.`,
        statusCode: 400,
      });
    }

    throw createError({
	statusMessage: "An unknown error occurred",
	statusCode: 500
    });
  }
});
