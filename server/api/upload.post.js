import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";
import os from "os";

export default defineEventHandler(async (event) => {
  const maxFiles = 1;
  const fileSize = 1024 * 1024 * 5; // 5MB

  try {
    
    let uploads_folder;
    
    if (process.env.VEASE_UPLOADS_FOLDER && fs.existsSync(process.env.VEASE_UPLOADS_FOLDER)) {
      uploads_folder = process.env.VEASE_UPLOADS_FOLDER;
      console.log("Using environment variable uploads folder:", uploads_folder);
    } else {
      const tmpDir = os.tmpdir();
      const veaseDir = path.join(tmpDir, "vease");
      
      console.log("Environment variable not available, searching in:", veaseDir);
      
      if (fs.existsSync(veaseDir)) {
        const projectDirs = fs.readdirSync(veaseDir)
          .map(dir => {
            const fullPath = path.join(veaseDir, dir);
            try {
              const stats = fs.statSync(fullPath);
              return { path: fullPath, mtime: stats.mtime, name: dir };
            } catch (e) {
              return null;
            }
          })
          .filter(item => item && fs.statSync(item.path).isDirectory())
          .sort((a, b) => b.mtime - a.mtime);
        
        console.log("Found project directories:", projectDirs.map(d => d.name));
        
        if (projectDirs.length > 0) {
          uploads_folder = path.join(projectDirs[0].path, "uploads");
          console.log("Using most recent project uploads folder:", uploads_folder);
        } else {
          throw new Error("No project directory found in vease folder");
        }
      } else {
        throw new Error("Vease directory not found in temp: " + veaseDir);
      }
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
        statusMessage: "File is required.",
        statusCode: 400,
      }); 
    }
    
    const uploadedFiles = [];
    
    for (let index = 0; index < Object.keys(files).length; index++) {
      const file = files[index][0];
      const filepath = file.filepath;
      const mimetype = file.mimetype;
      const originalName = file.originalFilename || 'unknown';

      console.log("Processing file:", { originalName, mimetype, filepath });

      if (!mimetype.startsWith("image")) {
        throw createError({
          statusMessage: "Only image allowed.",
          statusCode: 400,
        }); 
      }
      
      const extension = mimetype.split("/")[1];
      const imageName = `${Date.now()}_${Math.round(Math.random() * 10000000)}.${extension}`;
      const newPath = path.join(uploads_folder, imageName);
      
      console.log("Copying file from:", filepath);
      console.log("Copying file to:", newPath);
      
      if (!fs.existsSync(filepath)) {
        throw new Error(`Source file does not exist: ${filepath}`);
      }
      
      fs.copyFileSync(filepath, newPath);
      
      if (fs.existsSync(newPath)) {
        const stats = fs.statSync(newPath);
        console.log(`File copied successfully. Size: ${stats.size} bytes`);
        uploadedFiles.push({
          originalName,
          savedName: imageName,
          path: newPath,
          size: stats.size
        });
      } else {
        throw new Error(`Failed to copy file to: ${newPath}`);
      }
    }

    return {
      status: 200,
      message: "Upload image successfully.",
      uploads_folder: uploads_folder,
      files: uploadedFiles
    };
  } catch (error) {
    console.error("Upload error:", error);
    
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
