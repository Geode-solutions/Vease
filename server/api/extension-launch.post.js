import { createError, defineEventHandler, readBody } from "h3"
import path from "node:path"
import { setTimeout } from "node:timers/promises"
import { spawn } from "node:child_process"

// Store running extension processes
const extensionProcesses = new Map()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { extensionId, executablePath } = body

  if (!extensionId || !executablePath) {
    throw createError({
      statusCode: 400,
      message: "extensionId and executablePath are required",
    })
  }

  // Check if already running
  if (extensionProcesses.has(extensionId)) {
    console.log(`[Extension Launcher] ${extensionId} already running`)
    const existing = extensionProcesses.get(extensionId)
    return {
      success: true,
      port: existing.port,
      message: "Extension microservice already running",
    }
  }

  try {
    // Launch the extension backend
    console.log(
      `[Extension Launcher] Launching ${extensionId} from ${executablePath}`,
    )

    // The executablePath points to: .../extensions/vease-modeling/dist/vease-modeling-back.exe
    // The Python source should be at: .../extensions/vease-modeling/backend_src/vease_modeling_back/app.py
    const extensionDir = path.dirname(path.dirname(executablePath)) // Go up from dist/ to extension root
    const pythonScript = path.join(
      extensionDir,
      "backend_src",
      "vease_modeling_back",
      "app.py",
    )
    const pythonPath = path.join(extensionDir, "backend_src")

    const fs = await import("node:fs")
    if (!fs.existsSync(pythonScript)) {
      throw new Error(`Python backend source not found at ${pythonScript}`)
    }

    console.log(
      `[Extension Launcher] Launching Python script: python ${pythonScript}`,
    )

    const extensionProcess = spawn("python", [pythonScript], {
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        PYTHONPATH: pythonPath,
      },
    })

    let port = undefined

    // Capture stdout to get the port
    extensionProcess.stdout.on("data", (data) => {
      const output = data.toString()
      console.log(`[${extensionId}] ${output}`)

      // Look for port in output (format: "Running on http://0.0.0.0:5001")
      const portMatch = output.match(/Running on .*:(\d+)/)
      if (portMatch && !port) {
        ;[, port] = portMatch
        console.log(
          `[Extension Launcher] ${extensionId} running on port ${port}`,
        )
      }
    })

    extensionProcess.stderr.on("data", (data) => {
      console.error(`[${extensionId}] ERROR: ${data.toString()}`)
    })

    extensionProcess.on("close", (code) => {
      console.log(
        `[Extension Launcher] ${extensionId} exited with code ${code}`,
      )
      extensionProcesses.delete(extensionId)
    })

    // Store the process
    extensionProcesses.set(extensionId, {
      process: extensionProcess,
      port: null, // Will be updated when we parse stdout
      startedAt: new Date().toISOString(),
    })

    // Wait a bit for the process to start and output the port
    const launchTimeout = 2000
    await setTimeout(launchTimeout)

    // Update the port in the stored process info
    if (port) {
      const processInfo = extensionProcesses.get(extensionId)
      if (processInfo) {
        processInfo.port = port
      }
    }

    return {
      success: true,
      port: port || "5001", // Default port if not detected
      message: `Extension microservice ${extensionId} launched successfully`,
    }
  } catch (error) {
    console.error(
      `[Extension Launcher] Failed to launch ${extensionId}:`,
      error,
    )
    throw createError({
      statusCode: 500,
      message: `Failed to launch extension microservice: ${error.message}`,
    })
  }
})
