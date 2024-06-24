const fs = require("node:fs");
var fileContent;
try {
  fileContent = fs.readFileSync("./forge.config.cjs", "utf8");
} catch (err) {
  console.error(err);
}
if (process.platform === "win32") {
  fileContent = fileContent.replace("//GEODEAPP_BACK", "./electron-server/dist_back/geodeapp_back.exe");
  fileContent = fileContent.replace("//GEODEAPP_VIEWER", "./electron-server/dist_viewer/geodeapp_viewer.exe");
} else if (process.platform === "linux") {
  fileContent = fileContent.replace("//GEODEAPP_BACK", "./electron-server/dist_back/geodeapp_back");
  fileContent = fileContent.replace("//GEODEAPP_VIEWER", "./electron-server/dist_viewer/geodeapp_viewer");
}
fs.writeFileSync("./forge.config.cjs", fileContent);

