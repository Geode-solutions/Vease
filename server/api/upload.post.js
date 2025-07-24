import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";
import os from "os";

export default defineEventHandler(async (event) => {
  const maxFiles = 1;
  const fileSize = 1024 * 1024 * 5; // 5MB

  try {
    const tmpDir = os.tmpdir();
    const veaseDir = path.join(tmpDir, "vease");
    
    let uploads_folder;
    
    if (fs.existsSync(veaseDir)) {
      const projectDirs = fs.readdirSync(veaseDir)
        .map(dir => {
          const fullPath = path.join(veaseDir, dir);
          const stats = fs.statSync(fullPath);
          return { path: fullPath, mtime: stats.mtime, name: dir };
        })
        .filter(item => fs.statSync(item.path).isDirectory())
        .sort((a, b) => b.mtime - a.mtime); 
      
      if (projectDirs.length > 0) {
        uploads_folder = path.join(projectDirs[0].path, "uploads");
        console.log("Using uploads folder:", uploads_folder);
      } else {
        throw new Error("No project directory found in vease folder");
      }
    } else {
      throw new Error("Vease directory not found in temp");
    }
    
    if (!fs.existsSync(uploads_folder)) {
      fs.mkdirSync(uploads_folder, { recursive: true });
      console.log("Created uploads folder:", uploads_folder);
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
      let newPath = path.join(uploads_folder, imageName);
      console.log("Copying file to:", newPath);
      fs.copyFileSync(filepath, newPath);
    }

    return {
      status: 200,
      message: "Upload image successfully.",
      uploads_folder: uploads_folder // Pour debug
    }
  } catch (error) {
    console.error("Upload error:", error);
    
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
