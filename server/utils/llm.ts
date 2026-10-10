// Third party imports
import { type MCPClient, createMCPClient } from "@ai-sdk/mcp";
import { type Tool, type ToolSet, tool } from "ai";
import { getAppBaseUrl, getExtensionServerPorts } from "@ogw_server/utils/server_config";
import type { LanguageModelV4 } from "@ai-sdk/provider";
import { consola } from "consola";
import { createGateway } from "@ai-sdk/gateway";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

// Local imports
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

const LOOPBACK_HOST = "127.0.0.1";
const DEFAULT_GATEWAY_MODEL = "openai/gpt-4o-mini";
const CHAT_PROVIDER = { LLAMA: "llama", GATEWAY: "gateway" } as const;
type ChatProvider = (typeof CHAT_PROVIDER)[keyof typeof CHAT_PROVIDER];

const mcpClientsByUrl = new Map<string, Promise<MCPClient>>();

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

async function getLlamaChatModel(model: string | undefined): Promise<LanguageModelV4> {
  const { port, apiKey, model: resolvedModel } = await runLlamaServer({ model });

  const provider = createOpenAICompatible({
    name: "llama-cpp",
    baseURL: `http://${LOOPBACK_HOST}:${port}/v1`,
    apiKey,
  });
  return provider.chatModel(resolvedModel);
}

function getGatewayChatModel(
  model: string | undefined,
  apiKey: string | undefined,
): LanguageModelV4 {
  if (apiKey === undefined || apiKey === "") {
    throw new Error("Missing AI Gateway key for this request");
  }
  const provider = createGateway({ apiKey });
  return provider.languageModel(model ?? DEFAULT_GATEWAY_MODEL);
}

async function getChatModel({
  provider = CHAT_PROVIDER.LLAMA,
  model,
  gatewayApiKey,
}: {
  provider?: ChatProvider;
  model?: string;
  gatewayApiKey?: string;
} = {}): Promise<LanguageModelV4> {
  const chatModel =
    provider === CHAT_PROVIDER.GATEWAY
      ? getGatewayChatModel(model, gatewayApiKey)
      : await getLlamaChatModel(model);
  return chatModel;
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
    mcpClientsByUrl.delete(url);
    return undefined;
  }
}

interface ResourceEntry {
  client: MCPClient;
  uri?: string;
  uriTemplate?: string;
  name: string;
  description?: string;
}

const DATA_RESOURCE_URI = "vease://data";

function textOf(contents: Awaited<ReturnType<MCPClient["readResource"]>>["contents"]): string {
  return contents.flatMap((content) => ("text" in content ? [content.text] : [])).join("\n");
}

async function getResourcesFromUrl(url: string): Promise<ResourceEntry[]> {
  const client = await getMcpClient(url).catch((error: unknown) => {
    consola.error(`Failed to connect to MCP server ${url}`, error);
    mcpClientsByUrl.delete(url);
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
        return `Error reading ${uri}: ${error instanceof Error ? error.message : String(error)}`;
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
  CHAT_PROVIDER,
  createReadResourceTool,
  getChatModel,
  getChatTools,
  getResourceCatalog,
  readDataContext,
  type ChatProvider,
  type ResourceEntry,
};
