#!/usr/bin/env node

import { readFile, writeFile } from "fs/promises"
import { execSync } from "child_process"

async function main() {
  const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim()
  console.log(`Current branch: ${branch}`)

  const packageJsonPath = "package.json"

  try {
    const data = await readFile(packageJsonPath, "utf8")
    const pkg = JSON.parse(data)

    const deps = pkg.dependencies

    if (!deps || typeof deps !== "object") {
      console.log("No dependencies found. Copying package.json as-is.")
      await writeFile(packageJsonPath, data, "utf8")
      return
    }

    if (branch === "master") {
      for (const key in deps) {
        if (deps[key] === "0.0.0") {
          deps[key] = "latest"
        }
      }
    } else if (branch === "next") {
      for (const key in deps) {
        if (deps[key] === "0.0.0") {
          deps[key] = "next"
        }
      }
    } else {
      // Remove dependencies with "0.0.0"
      for (const key in deps) {
        if (deps[key] === "0.0.0") {
          delete deps[key]
        }
      }
    }

    const updatedJson = JSON.stringify(pkg, null, 2)
    await writeFile(packageJsonPath, updatedJson, "utf8")
    console.log(`Updated dependencies written to ${packageJsonPath}`)
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`Error: ${packageJsonPath} not found.`)
    } else if (err instanceof SyntaxError) {
      console.error("Error: Invalid JSON in package.json")
    } else {
      console.error("Error processing package.json:", err.message)
    }
    process.exit(1)
  }
}

main()
