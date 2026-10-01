import child_process from "node:child_process";
import { consola } from "consola";

/**
 * @param {{ path: string }} configuration
 */
export default function customSign(configuration) {
  consola.info("customSign", configuration);

  child_process.execSync(
    `AzureSignTool sign \
    --azure-key-vault-url "${process.env.AZURE_KEY_VAULT_URI}" \
    --azure-key-vault-client-id "${process.env.AZURE_CLIENT_ID}" \
    --azure-key-vault-tenant-id "${process.env.AZURE_TENANT_ID}" \
    --azure-key-vault-client-secret "${process.env.AZURE_CLIENT_SECRET}" \
    --azure-key-vault-certificate ${process.env.AZURE_CERT_NAME} \
    --timestamp-rfc3161 http://timestamp.digicert.com \
    -v ${configuration.path}`,
    { stdio: "inherit" },
  );
}
