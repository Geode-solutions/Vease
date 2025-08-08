import { platform } from "os";
import { execSync } from "child_process";

if (platform() === "win32") {
  console.log("Running tests on Windows");
  execSync("npm run test:windows", { stdio: "inherit" });
} else {
  console.log("Running tests on Linux");
  execSync("npm run test:linux", { stdio: "inherit" });
}
