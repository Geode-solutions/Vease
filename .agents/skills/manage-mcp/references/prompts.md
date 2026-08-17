# Prompt Examples

`defineMcpPrompt` exposes reusable message templates the LLM (or the user) can invoke. Auto-discovered from `server/mcp/prompts/`.

Handlers can return either a full `GetPromptResult` or a **plain string** — strings are wrapped into a single user message (use `role: 'assistant'` to wrap as an assistant message).

## Simple String Prompt

```typescript [server/mcp/prompts/code-review.ts]
export default defineMcpPrompt({
  description: 'Code-review assistant — concise, actionable feedback',
  handler: async () => 'You are a senior reviewer. Be concise and actionable.',
})
```

## Parameterized Prompt

```typescript [server/mcp/prompts/review.ts]
import { z } from 'zod'

export default defineMcpPrompt({
  description: 'Generate a focused code review',
  inputSchema: {
    language: z.string().describe('Programming language'),
    focus: z.array(z.enum(['performance', 'security', 'maintainability', 'tests']))
      .describe('Areas to focus on'),
  },
  handler: async ({ language, focus }) =>
    `Review my ${language} code. Focus on: ${focus.join(', ')}. Provide specific suggestions with examples.`,
})
```

## Argument Autocomplete with `completable()`

`completable` wraps a Zod field with a dynamic suggestion source. Clients that support `prompts/complete` (Cursor, Claude Desktop) surface these in the input UI:

```typescript [server/mcp/prompts/open-issue.ts]
import { z } from 'zod'

export default defineMcpPrompt({
  description: 'Open an issue for a project',
  inputSchema: {
    project: completable(z.string(), async (value) => {
      const projects = await listProjects()
      return projects
        .filter(p => p.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 5)
    }).describe('Project name'),
    severity: z.enum(['low', 'medium', 'high', 'critical']).describe('Severity'),
  },
  handler: async ({ project, severity }) =>
    `Open a ${severity} issue for project "${project}". Include reproduction steps and acceptance criteria.`,
})
```

## Documentation Generator

```typescript [server/mcp/prompts/api-docs.ts]
import { z } from 'zod'

export default defineMcpPrompt({
  description: 'Generate API documentation',
  inputSchema: {
    apiType: z.enum(['REST', 'GraphQL', 'gRPC']).describe('API type'),
    includeExamples: z.boolean().default(true).describe('Include code examples'),
  },
  handler: async ({ apiType, includeExamples }) => `Generate documentation for this ${apiType} API.
${includeExamples ? 'Include practical code examples.' : ''}

Format:
- Overview
- Endpoints / Operations
- Request / Response schemas
- Error handling
${includeExamples ? '- Usage examples' : ''}`,
})
```

## Multi-Message Prompt (Full `GetPromptResult`)

When you need more than one message — e.g. a structured user → assistant scaffold — return the full shape:

```typescript [server/mcp/prompts/debug.ts]
import { z } from 'zod'

export default defineMcpPrompt({
  description: 'Structured debugging session',
  inputSchema: {
    issue: z.string().describe('Problem description'),
    environment: z.enum(['development', 'staging', 'production']).describe('Environment'),
  },
  handler: async ({ issue, environment }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `I'm debugging an issue in ${environment}:\n\n${issue}\n\nHelp me identify the root cause, suggest debugging steps, and recommend a fix.${
            environment === 'production' ? ' Prioritize quick wins to minimize downtime.' : ''
          }`,
        },
      },
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: 'I\'ll analyze this systematically. Let me start by mapping the symptoms to likely causes:',
        },
      },
    ],
  }),
})
```

::callout{icon="i-lucide-info" color="info"}
The MCP spec only allows `'user'` and `'assistant'` roles. Put system instructions inside the user message text.
::

## Default Role for String Returns

```typescript [server/mcp/prompts/persona.ts]
export default defineMcpPrompt({
  description: 'Assistant persona',
  role: 'assistant', // string returns are wrapped as assistant messages
  handler: async () => 'I am a senior backend engineer. Ask me about distributed systems.',
})
```

## Conditional Visibility (`enabled`)

```typescript [server/mcp/prompts/admin-help.ts]
export default defineMcpPrompt({
  description: 'Admin runbook',
  enabled: event => Boolean(event.context.user?.isAdmin),
  handler: async () => 'You are reviewing the admin runbook. Be precise and reference exact CLI commands.',
})
```

## Groups & Tags

Auto-inferred from subfolders — `server/mcp/prompts/onboarding/welcome.ts` → `group: 'onboarding'`. Override explicitly:

```typescript
export default defineMcpPrompt({
  group: 'onboarding',
  tags: ['public', 'first-run'],
  description: 'Welcome message',
  handler: async () => 'Welcome! Here is what you can do…',
})
```

## See also

- [Prompts docs](https://mcp-toolkit.nuxt.dev/prompts/overview)
- [Authoring & structure](https://mcp-toolkit.nuxt.dev/prompts/authoring)
- [Input, handler & messages](https://mcp-toolkit.nuxt.dev/prompts/input-handler-messages)
- [Patterns & advanced](https://mcp-toolkit.nuxt.dev/prompts/patterns-advanced)
