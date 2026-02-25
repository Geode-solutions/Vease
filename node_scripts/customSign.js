import child_process from "node:child_process"
import fs from "node:fs"
import path from "node:path"

export default async function customSign(configuration) {
  console.log("customSign", configuration)
  for (const file of fs.readdirSync(path.dirname(configuration.path))) {
    console.log(file)
  }
  for (const file of fs.readdirSync(
    path.join(path.dirname(configuration.path), "app.asar.unpacked"),
  )) {
    console.log("assar", file)
  }
  for (const file of fs.readdirSync(
    path.dirname(path.dirname(configuration.path)),
  )) {
    console.log("1", file)
  }
  for (const file of fs.readdirSync(
    path.dirname(path.dirname(path.dirname(configuration.path))),
  )) {
    console.log("2", file)
  }
  for (const file of fs.readdirSync(
    path.dirname(path.dirname(path.dirname(path.dirname(configuration.path)))),
  )) {
    console.log("3", file)
  }
  for (const file of fs.readdirSync(
    path.dirname(
      path.dirname(
        path.dirname(path.dirname(path.dirname(configuration.path))),
      ),
    ),
  )) {
    console.log("4", file)
  }

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
  )
}
