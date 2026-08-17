// Node imports
import path from 'node:path'

// Third party imports
import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import fs from 'node:fs/promises'
import { z } from 'zod'

export default defineMcpTool({
  name: 'load-file',
  description:
    'The required way to load a file into Vease. Always use this tool instead of ' +
    'calling /api/controller/data/load directly or writing custom fetch/curl code — ' +
    'this tool handles multipart form encoding, extension validation, and error ' +
    'formatting correctly. Accepts an absolute path to a file already on disk.',
  inputSchema: {
    filePath: z.string().describe('Absolute path to the file on disk to upload'),
  },
  handler: async ({ filePath }) => {
    console.log("HELLO FROM LOAD FILE TOOL")
    let fileBuffer = undefined
    try {
      fileBuffer = await fs.readFile(filePath)
    } catch {
      return `Error: could not read file at ${filePath}`
    }

    const filename = path.basename(filePath)
    const formData = new FormData()
    formData.append('file', new Blob([fileBuffer]), filename)

    try {
      const response = await fetch("http://localhost:3000/api/controller/data/load", {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}))
        const message =
          errorPayload?.statusMessage ??
          errorPayload?.message ??
          response.statusText ??
          'Unknown error'
        return `Error loading file: ${message}`
      }

      const payload = await response.json().catch(() => undefined)
      return `File loaded successfully: ${JSON.stringify(payload ?? { ok: true })}`
    } catch (error) {
      const message = error?.data?.statusMessage ?? error?.message ?? 'Unknown error'
      return `Error loading file: ${message}`
    }
  },
})