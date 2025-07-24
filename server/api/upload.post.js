import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";
import os from "os";

export default defineEventHandler(async (event) => {
  const maxFiles = 1;
  const fileSize = 1024 * 1024 * 5; // 5MB

  try {
    // Créer le chemin vers le dossier uploads
    const veaseDir = path.join(os.tmpdir(), "vease");
    let uploadsFolder;
    
    if (fs.existsSync(veaseDir)) {
      // Trouver le dossier de projet le plus récent
      const projectDirs = fs.readdirSync(veaseDir)
        .filter(dir => fs.statSync(path.join(veaseDir, dir)).isDirectory())
        .map(dir => ({
          name: dir,
          path: path.join(veaseDir, dir),
          mtime: fs.statSync(path.join(veaseDir, dir)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);
      
      if (projectDirs.length > 0) {
        uploadsFolder = path.join(projectDirs[0].path, "uploads");
      } else {
        throw new Error("Aucun dossier de projet trouvé");
      }
    } else {
      throw new Error("Dossier vease non trouvé");
    }
    
    // Créer le dossier uploads s'il n'existe pas
    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder, { recursive: true });
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
      let newPath = path.join(uploadsFolder, imageName);
      fs.copyFileSync(filepath, newPath);
      
      console.log(`Fichier sauvegardé dans: ${newPath}`);
    }

    return {
      status: 200,
      message: "Upload image successfully.",
    }
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
