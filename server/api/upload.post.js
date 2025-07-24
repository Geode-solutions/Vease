import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";
import os from "os";

export default defineEventHandler(async (event) => {
  const maxVeaseFiles = 1;
  const veaseFileSize = 1024 * 1024 * 50; // 50MB

  try {
    const veaseProjectsDir = path.join(os.tmpdir(), "vease");
    let veaseUploadsFolder;
    
    if (fs.existsSync(veaseProjectsDir)) {
      const veaseProjectDirectories = fs.readdirSync(veaseProjectsDir)
        .filter(projectDir => fs.statSync(path.join(veaseProjectsDir, projectDir)).isDirectory())
        .map(projectDir => ({
          projectName: projectDir,
          projectPath: path.join(veaseProjectsDir, projectDir),
          lastModified: fs.statSync(path.join(veaseProjectsDir, projectDir)).mtime
        }))
        .sort((a, b) => b.lastModified - a.lastModified);
      
      if (veaseProjectDirectories.length > 0) {
        veaseUploadsFolder = path.join(veaseProjectDirectories[0].projectPath, "uploads");
      } else {
        throw new Error("No Vease project directory found");
      }
    } else {
      throw new Error("Vease projects directory not found");
    }
    
    if (!fs.existsSync(veaseUploadsFolder)) {
      fs.mkdirSync(veaseUploadsFolder, { recursive: true });
    }

    const { files: uploadedFiles } = await readFiles(event, {
      maxFiles: maxVeaseFiles,
      maxFileSize: veaseFileSize,
    });

    if (!Object.keys(uploadedFiles).length) {
      throw createError({
        statusMessage: "2001",
        statusCode: 400,
      }); 
    }
    
    for (let fileIndex = 0; fileIndex < Object.keys(uploadedFiles).length; fileIndex++) {
      const veaseFilePath = uploadedFiles[fileIndex][0].filepath;
      const originalFileName = uploadedFiles[fileIndex][0].originalFilename || 'unknown';
      const fileExtension = path.extname(originalFileName).toLowerCase();

      if (!allowedExtensions.includes(fileExtension.replace('.', ''))) {
        throw createError({
          statusMessage: "Invalid file type. Allowed extensions: " + allowedExtensions.map(ext => '.' + ext).join(', '),
          statusCode: 400,
        });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const uniqueFileName = `${timestamp}_${originalFileName}`;
      const veaseNewPath = path.join(veaseUploadsFolder, uniqueFileName);

      fs.copyFileSync(veaseFilePath, veaseNewPath);
    }

    return {
      uploadPath: veaseUploadsFolder
    };

  } catch (error) {
    console.error("Erreur upload:", error);
    
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
