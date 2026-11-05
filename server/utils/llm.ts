// Third party imports
import { type MCPClient, createMCPClient } from "@ai-sdk/mcp";
import { type Tool, type ToolSet, tool } from "ai";
import { getAppBaseUrl, getExtensionServerPorts } from "@ogw_server/utils/server_config";
import { consola } from "consola";
import { z } from "zod";

// Local imports
import { LOOPBACK_HOST } from "@vease_server/utils/llm_model";

const mcpClientsByUrl = new Map<string, Promise<MCPClient>>();

interface ResourceEntry {
  client: MCPClient;
  uri?: string;
  uriTemplate?: string;
  name: string;
  description?: string;
}

const DATA_RESOURCE_URI = "vease://data";
// What a server offers hardly changes, so its resources are listed once per client
const resourceCatalogsByUrl = new Map<string, Promise<ResourceEntry[]>>();

function getAppMcpUrl(): string {
  return `${getAppBaseUrl()}/mcp`;
}

function getMcpBaseUrls(): string[] {
  const urls = [getAppMcpUrl()];
  for (const port of getExtensionServerPorts().values()) {
    urls.push(`http://${LOOPBACK_HOST}:${port}/mcp`);
  }
  return urls;
}

function forgetMcpServer(url: string): void {
  mcpClientsByUrl.delete(url);
  resourceCatalogsByUrl.delete(url);
}

async function getMcpClient(url: string): Promise<MCPClient> {
  let clientPromise = mcpClientsByUrl.get(url);
  if (!clientPromise) {
    clientPromise = createMCPClient({ transport: { type: "http", url } });
    mcpClientsByUrl.set(url, clientPromise);
  }
  const client = await clientPromise;
  return client;
}

async function getToolsFromUrl(
  url: string,
): Promise<Awaited<ReturnType<MCPClient["tools"]>> | undefined> {
  try {
    const client = await getMcpClient(url);
    return await client.tools();
  } catch (error) {
    consola.error(`Failed to load MCP tools from ${url}`, error);
    forgetMcpServer(url);
    return undefined;
  }
}

function textOf(contents: Awaited<ReturnType<MCPClient["readResource"]>>["contents"]): string {
  return contents
    .filter((content) => "text" in content)
    .map((content) => content.text)
    .join("\n");
}

async function listResourcesFromUrl(url: string): Promise<ResourceEntry[]> {
  const client = await getMcpClient(url).catch((error: unknown) => {
    consola.error(`Failed to connect to MCP server ${url}`, error);
    forgetMcpServer(url);
    return undefined;
  });
  if (client === undefined) {
    return [];
  }
  const [resourcesResult, templatesResult] = await Promise.allSettled([
    client.listResources(),
    client.listResourceTemplates(),
  ]);
  const entries: ResourceEntry[] = [];
  if (resourcesResult.status === "fulfilled") {
    entries.push(
      ...resourcesResult.value.resources.map(({ uri, name, description }) => ({
        client,
        uri,
        name,
        description,
      })),
    );
  } else {
    consola.error(`Failed to list MCP resources from ${url}`, resourcesResult.reason);
  }
  if (templatesResult.status === "fulfilled") {
    entries.push(
      ...templatesResult.value.resourceTemplates.map(({ uriTemplate, name, description }) => ({
        client,
        uriTemplate,
        name,
        description,
      })),
    );
  } else {
    consola.error(`Failed to list MCP resource templates from ${url}`, templatesResult.reason);
  }
  return entries;
}

async function getResourcesFromUrl(url: string): Promise<ResourceEntry[]> {
  let catalog = resourceCatalogsByUrl.get(url);
  if (!catalog) {
    catalog = listResourcesFromUrl(url);
    resourceCatalogsByUrl.set(url, catalog);
  }
  const entries = await catalog;
  return entries;
}

async function getResourceCatalog(): Promise<ResourceEntry[]> {
  // oxlint-disable-next-line unicorn/no-array-callback-reference
  const catalogs = await Promise.all(getMcpBaseUrls().map(getResourcesFromUrl));
  return catalogs.flat();
}

function entryKey({ uri, uriTemplate }: ResourceEntry): string {
  return uri ?? uriTemplate ?? "";
}

function templateMatches(uriTemplate: string, uri: string): boolean {
  const pattern = uriTemplate
    .split(/\{[^}]+\}/u)
    .map((part) => part.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`))
    .join("[^/]+");
  return new RegExp(`^${pattern}$`, "u").test(uri);
}

function findResourceEntry(catalog: ResourceEntry[], uri: string): ResourceEntry | undefined {
  return (
    catalog.find((entry) => entry.uri === uri) ??
    catalog.find(
      (entry) => entry.uriTemplate !== undefined && templateMatches(entry.uriTemplate, uri),
    )
  );
}

function createReadResourceTool(catalog: ResourceEntry[]): Tool {
  const lines = catalog.map((entry) => `- ${entryKey(entry)}: ${entry.description ?? entry.name}`);
  return tool({
    description: `Read application state. Available resources:\n${lines.join("\n")}`,
    inputSchema: z.object({ uri: z.string() }),
    execute: async ({ uri }) => {
      const entry = findResourceEntry(catalog, uri);
      if (entry === undefined) {
        return `Unknown resource "${uri}". Available: ${catalog.map((item) => entryKey(item)).join(", ")}`;
      }
      try {
        const { contents } = await entry.client.readResource({ uri });
        return textOf(contents);
      } catch (error) {
        if (error instanceof Error) {
          return `Error reading ${uri}: ${error.message}`;
        }
        return `Error reading ${uri}: ${String(error)}`;
      }
    },
  });
}

async function readDataContext(): Promise<string | undefined> {
  try {
    const client = await getMcpClient(getAppMcpUrl());
    const { contents } = await client.readResource({ uri: DATA_RESOURCE_URI });
    return textOf(contents);
  } catch (error) {
    consola.error(`Failed to read ${DATA_RESOURCE_URI}`, error);
    return undefined;
  }
}

async function getChatTools(): Promise<ToolSet> {
  // Wrapping this in an arrow to appease no-array-callback-reference trips
  // Typescript/promise-function-async + eslint/require-await against each other instead (an arrow
  // Around an already-async call has no `await` of its own) — no phrasing satisfies all three.
  const [toolSets, catalog] = await Promise.all([
    // oxlint-disable-next-line unicorn/no-array-callback-reference
    Promise.all(getMcpBaseUrls().map(getToolsFromUrl)),
    getResourceCatalog(),
  ]);
  const mergedTools: ToolSet = {};
  for (const toolSet of toolSets) {
    if (toolSet !== undefined) {
      Object.assign(mergedTools, toolSet);
    }
  }
  if (catalog.length > 0) {
    mergedTools["read-resource"] = createReadResourceTool(catalog);
  }
  return mergedTools;
}

export {
  createReadResourceTool,
  getChatTools,
  getResourceCatalog,
  readDataContext,
  type ResourceEntry,
};
