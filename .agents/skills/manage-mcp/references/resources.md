# Resource Examples

`defineMcpResource` exposes read-only data addressable by URI. The toolkit auto-discovers any file under `server/mcp/resources/`. Two shapes:

- **File shorthand** — set `file: '…'` and the toolkit auto-generates the URI, MIME type, and handler.
- **Standard / template** — set `uri` (string or `ResourceTemplate`) and a `handler`.

## File Shorthand (zero handler)

```typescript [server/mcp/resources/readme.ts]
export default defineMcpResource({
  description: 'Project README file',
  file: 'README.md', // URI auto-generated as file:///…/README.md
})
```

The MIME type is inferred from the extension (`.md` → `text/markdown`, `.json` → `application/json`, etc.). Override via `metadata.mimeType` if needed.

## Static Resource (custom URI + handler)

```typescript [server/mcp/resources/config.ts]
export default defineMcpResource({
  description: 'Application configuration',
  uri: 'config:///app',
  metadata: { mimeType: 'application/json' },
  handler: async (uri) => ({
    contents: [{
      uri: uri.toString(),
      mimeType: 'application/json',
      text: JSON.stringify({
        environment: process.env.NODE_ENV,
        apiUrl: process.env.API_URL,
        features: { darkMode: true, analytics: false },
      }, null, 2),
    }],
  }),
})
```

## Database Resource (with caching)

```typescript [server/mcp/resources/users.ts]
import { useDrizzle } from '~/server/utils/drizzle'
import { users as usersTable } from '~/server/db/schema'

export default defineMcpResource({
  description: 'List recent users',
  uri: 'db:///users',
  metadata: { mimeType: 'application/json' },
  cache: '1m',
  handler: async (uri) => {
    const users = await useDrizzle().select().from(usersTable).limit(100)
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(users, null, 2),
      }],
    }
  },
})
```

## Template Resource (URI variables)

For URI patterns with placeholders, pass a `ResourceTemplate` from the SDK:

```typescript [server/mcp/resources/user.ts]
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

export default defineMcpResource({
  description: 'Fetch a user by ID',
  uri: new ResourceTemplate('user:///{id}', { list: undefined }),
  metadata: { mimeType: 'application/json' },
  handler: async (uri, { id }) => {
    const user = await getUser(String(id))
    if (!user) {
      throw createError({ statusCode: 404, message: `User ${id} not found` })
    }
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(user, null, 2),
      }],
    }
  },
})
```

The second handler argument is the parsed URI variables (`{ id }`). For collections, set `list: () => ({ resources: [...] })` on the template to advertise enumerable items.

## Resource with Annotations

`metadata.annotations` lets clients prioritize and filter what they show:

```typescript
export default defineMcpResource({
  description: 'Project README',
  file: 'README.md',
  metadata: {
    mimeType: 'text/markdown',
    annotations: {
      audience: ['user', 'assistant'], // who should see it
      priority: 0.8,                    // 0-1, helps clients pick
      lastModified: new Date().toISOString(),
    },
  },
})
```

Anything else under `metadata` is forwarded as `_meta` in the listing response — handy for custom UI fields.

## Conditional Visibility (`enabled`)

Hide a resource per request — runs after middleware so `event.context` is available:

```typescript [server/mcp/resources/private-keys.ts]
export default defineMcpResource({
  description: 'Private API keys for the current user',
  uri: 'config:///keys',
  enabled: event => Boolean(event.context.user?.isAdmin),
  metadata: { mimeType: 'application/json' },
  handler: async (uri) => {
    const event = useEvent()
    const keys = await listKeys(event.context.user.id)
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(keys),
      }],
    }
  },
})
```

## Groups & Tags

Auto-inferred from subfolders — `server/mcp/resources/admin/keys.ts` → `group: 'admin'`. Override explicitly:

```typescript
export default defineMcpResource({
  group: 'admin',
  tags: ['secret'],
  description: 'Sensitive resource',
  // ...
})
```

`listMcpResources({ group: 'admin' })` and `getMcpResources({ tags: ['secret'] })` filter by these.

## Binary Content

Return `blob` (base64) instead of `text` for binary payloads:

```typescript [server/mcp/resources/logo.ts]
import { readFile } from 'node:fs/promises'

export default defineMcpResource({
  description: 'Project logo',
  uri: 'asset:///logo',
  metadata: { mimeType: 'image/png' },
  handler: async (uri) => {
    const buffer = await readFile('public/logo.png')
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'image/png',
        blob: buffer.toString('base64'),
      }],
    }
  },
})
```

## See also

- [Resources docs](https://mcp-toolkit.nuxt.dev/resources/overview)
- [Static resources & structure](https://mcp-toolkit.nuxt.dev/resources/static-and-structure)
- [Templates & handlers](https://mcp-toolkit.nuxt.dev/resources/templates-and-handlers)
- [Metadata, content & errors](https://mcp-toolkit.nuxt.dev/resources/content-metadata-errors)
