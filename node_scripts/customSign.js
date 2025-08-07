import child_process from "child_process";

exports.default = async function (configuration) {
  console.log("customSign", configuration);

  child_process.execSync(
    `AzureSignTool sign \
    --azure-key-vault-url "${process.env.AZURE_KEY_VAULT_URI}" \
    --azure-key-vault-client-id "${process.env.AZURE_CLIENT_ID}" \
    --azure-key-vault-tenant-id "${process.env.AZURE_TENANT_ID}" \
    --azure-key-vault-client-secret "${process.env.AZURE_CLIENT_SECRET}" \
    --azure-key-vault-certificate ${process.env.AZURE_CERT_NAME} \
    --timestamp-rfc3161 http://timestamp.digicert.com \
    -v ${configuration.path}`,
    { stdio: "inherit" }
  );
};
