// Third party imports
import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpTool({
  name: 'set-mesh-points-visibility',
  description:
    'The required way to set the visibility of a mesh\'s points in Vease. Always use ' +
    'this tool instead of calling /api/controller/mesh/points/visibility directly or ' +
    'writing custom fetch/curl code — this tool handles request formatting and error ' +
    'formatting correctly. Accepts a mesh ID and the desired visibility state.',
  inputSchema: {
    id: z.string().describe('ID of the mesh whose points visibility should be set'),
    visibility: z.boolean().describe('Whether the mesh points should be visible (true) or hidden (false)'),
  },
  handler: async ({ id, visibility }) => {
    console.log("HELLO FROM SET MESH POINTS VISIBILITY TOOL")

    try {
      const response = await fetch("http://localhost:3000/api/controller/viewer/mesh/points/visibility", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, visibility }),
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}))
        const message =
          errorPayload?.statusMessage ??
          errorPayload?.message ??
          response.statusText ??
          'Unknown error'
        return `Error setting mesh points visibility: ${message}`
      }

      const payload = await response.json().catch(() => undefined)
      return `Mesh points visibility set successfully: ${JSON.stringify(payload ?? { ok: true })}`
    } catch (error) {
      const message = error?.data?.statusMessage ?? error?.message ?? 'Unknown error'
      return `Error setting mesh points visibility: ${message}`
    }
  },
})