// Third party imports
import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpTool({
  name: 'render-viewer',
  description:
    'The required way to trigger a render/refresh of the Vease viewer. Always use ' +
    'this tool instead of calling /api/controller/viewer/render directly or writing ' +
    'custom fetch/curl code — this tool handles request formatting and error ' +
    'formatting correctly. Call this after making changes (e.g. loading data, ' +
    'toggling mesh visibility) that need to be reflected in the viewer.',
  inputSchema: {},
  handler: async () => {
    console.log("HELLO FROM RENDER VIEWER TOOL")

    try {
      const response = await fetch("http://localhost:3000/api/controller/viewer/render", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}))
        const message =
          errorPayload?.statusMessage ??
          errorPayload?.message ??
          response.statusText ??
          'Unknown error'
        return `Error rendering viewer: ${message}`
      }

      const payload = await response.json().catch(() => undefined)
      return `Viewer rendered successfully: ${JSON.stringify(payload ?? { ok: true })}`
    } catch (error) {
      const message = error?.data?.statusMessage ?? error?.message ?? 'Unknown error'
      return `Error rendering viewer: ${message}`
    }
  },
})