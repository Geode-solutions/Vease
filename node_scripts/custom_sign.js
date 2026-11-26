import child_process from "node:child_process";
import { consola } from "consola";

/**
 * Signs with Azure Artifact Signing. The environment comes from the
 * Geode-solutions/actions install/azure-sign action, set on master and next only.
 * @param {{ path: string }} configuration
 */
export default function customSign(configuration) {
  const token = process.env.ARTIFACT_SIGNING_TOKEN;
  if (token === undefined || token === "") {
    consola.info("Code signing skipped: no Artifact Signing token", configuration.path);
    return;
  }
  consola.info("customSign", configuration.path);
  child_process.execFileSync(
    "java",
    [
      "-jar",
      process.env.JSIGN_JAR,
      "--storetype",
      "TRUSTEDSIGNING",
      "--keystore",
      process.env.ARTIFACT_SIGNING_ENDPOINT,
      "--storepass",
      "env:ARTIFACT_SIGNING_TOKEN",
      "--alias",
      process.env.ARTIFACT_SIGNING_PROFILE,
      "--tsaurl",
      "http://timestamp.acs.microsoft.com",
      "--tsmode",
      "RFC3161",
      "--tsretries",
      "3",
      "--tsretrywait",
      "10",
      configuration.path,
    ],
    { stdio: "inherit" },
  );
}
