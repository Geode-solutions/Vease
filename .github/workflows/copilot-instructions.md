## MCP Tools

Do not modify files in `server/mcp/tools/`. Do not use curl, fetch, or terminal
commands to call `/api/controller/data/load` or any other Nitro API route directly.
Always use the corresponding MCP tool (e.g. `load-file`) instead.