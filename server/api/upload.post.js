import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";
import os from "os";

// Fonction pour récupérer les extensions autorisées depuis l'API
async function getAllowedExtensions() {
  try {
    // URL du backend OpenGeodeWeb (port par défaut 5000)
    const backendUrl = 'http://localhost:5000';
    
    const response = await $fetch('/opengeodeweb_back/allowed_files', {
      baseURL: backendUrl,
      method: 'POST',
      body: {
        supported_feature: null
      }
    });
    
    return response.extensions || [];
  } catch (error) {
    console.warn('Erreur lors de la récupération des extensions autorisées:', error);
    // Fallback vers une liste statique en cas d'erreur
    return [
      'brep', 'og_brep', 'msh', 'vtu', 'vtp', 'vtm', 'obj', 'ply', 'stl',
      'ts', 'vs', 'so', 'smesh', 'mesh', 'geode', 'ml', 'inp', 'nas', 'bdf'
    ];
  }
}

export default defineEventHandler(async (event) => {
  const maxFiles = 1;
  const maxFileSize = 1024 * 1024 * 50; // 50MB

  try {
    // Récupérer les extensions autorisées depuis l'API
    const allowedExtensions = await getAllowedExtensions();
    
    const veaseProjectsDir = path.join(os.tmpdir(), "vease");
    let uploadsFolder;
    
    if (fs.existsSync(veaseProjectsDir)) {
      const projectDirectories = fs.readdirSync(veaseProjectsDir)
        .filter(projectDir => fs.statSync(path.join(veaseProjectsDir, projectDir)).isDirectory())
        .map(projectDir => ({
          projectName: projectDir,
          projectPath: path.join(veaseProjectsDir, projectDir),
          lastModified: fs.statSync(path.join(veaseProjectsDir, projectDir)).mtime
        }))
        .sort((a, b) => b.lastModified - a.lastModified);
      
      if (projectDirectories.length > 0) {
        uploadsFolder = path.join(projectDirectories[0].projectPath, "uploads");
      } else {
        throw new Error("No Vease project directory found");
      }
    } else {
      throw new Error("Vease projects directory not found");
    }
    
    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder, { recursive: true });
    }

    const { files: uploadedFiles } = await readFiles(event, {
      maxFiles: maxFiles,
      maxFileSize: maxFileSize,
    });

    if (!Object.keys(uploadedFiles).length) {
      throw createError({
        statusMessage: "Aucun fichier téléchargé",
        statusCode: 400,
      }); 
    }
    
    for (let fileIndex = 0; fileIndex < Object.keys(uploadedFiles).length; fileIndex++) {
      const filePath = uploadedFiles[fileIndex][0].filepath;
      const originalFileName = uploadedFiles[fileIndex][0].originalFilename || 'unknown';
      const fileExtension = path.extname(originalFileName).toLowerCase().replace('.', '');

      if (!allowedExtensions.includes(fileExtension)) {
        throw createError({
          statusMessage: `Type de fichier invalide. Extensions autorisées: ${allowedExtensions.map(ext => '.' + ext).join(', ')}`,
          statusCode: 400,
        });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const uniqueFileName = `${timestamp}_${originalFileName}`;
      const newPath = path.join(uploadsFolder, uniqueFileName);

      fs.copyFileSync(filePath, newPath);
    }

    return {
      uploadPath: uploadsFolder,
      allowedExtensions: allowedExtensions
    };

  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    if (error instanceof formidableErrors.FormidableError) {
      if (error.code === 1009) {
        throw createError({
          statusMessage: "Fichier trop volumineux (maximum 50MB)",
          statusCode: 413,
        });
      }
      if (error.code === 1001) {
        throw createError({
          statusMessage: "Trop de fichiers (maximum 1 fichier)",
          statusCode: 400,
        });
      }
    }
    
    console.error('Erreur lors de l\'upload:', error);
    throw createError({
      statusMessage: "Erreur interne du serveur lors de l'upload",
      statusCode: 500,
    });
  }
});
