import {
  CHAT_PROVIDER,
  getChatModel,
  getChatTools,
  type readDataContext,
} from "@vease_server/utils/llm";
import { type Mock, beforeEach, describe, expect, test, vi } from "vitest";
import type { getAppBaseUrl, getExtensionServerPorts } from "@ogw_server/utils/server_config";
import type { ToolExecutionOptions } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { createMCPClient } from "@ai-sdk/mcp";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { runLlamaServer } from "@vease_server/utils/llama_cpp";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease_server/utils/llama_cpp"), () => ({
  runLlamaServer: vi.fn<typeof runLlamaServer>().mockResolvedValue({
    port: 8080,
    apiKey: "test-llama-api-key-12345",
    model: "llama-3-8b",
  }),
}));

vi.mock(import("@ai-sdk/openai-compatible"), () => ({
  createOpenAICompatible: vi.fn<typeof createOpenAICompatible>().mockReturnValue({
    chatModel: vi
      .fn<(modelId: string) => { modelId: string }>()
      .mockImplementation((modelId) => ({ modelId })),
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the `chatModel` member this codebase uses, not the full SDK provider shape
  } as unknown as ReturnType<typeof createOpenAICompatible>),
}));

vi.mock(import("@ai-sdk/gateway"), () => ({
  createGateway: vi.fn<typeof createGateway>().mockReturnValue({
    languageModel: vi
      .fn<(modelId: string) => { modelId: string }>()
      .mockImplementation((modelId) => ({ modelId })),
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the `languageModel` member this codebase uses, not the full SDK provider shape
  } as unknown as ReturnType<typeof createGateway>),
}));

vi.mock(import("@ai-sdk/mcp"), () => ({
  createMCPClient: vi.fn<typeof createMCPClient>().mockResolvedValue({
    tools: vi
      .fn<() => Promise<{ search_tools: Record<string, unknown> }>>()
      .mockResolvedValue({ search_tools: {} }),
    listResources: vi.fn<() => Promise<unknown>>().mockResolvedValue({ resources: [] }),
    listResourceTemplates: vi
      .fn<() => Promise<unknown>>()
      .mockResolvedValue({ resourceTemplates: [] }),
    readResource: vi.fn<() => Promise<unknown>>().mockResolvedValue({ contents: [] }),
    // oxlint-disable-next-line no-unsafe-type-assertion -- mock only implements the `tools` and resource members this codebase uses, not the full SDK client shape
  } as unknown as Awaited<ReturnType<typeof createMCPClient>>),
}));

vi.mock(import("@ogw_server/utils/server_config"), () => ({
  getAppBaseUrl: vi.fn<typeof getAppBaseUrl>().mockReturnValue("http://localhost:3000"),
  getExtensionServerPorts: vi.fn<typeof getExtensionServerPorts>().mockReturnValue(new Map()),
}));

const MODELING_PORT = 9001;
const DATA_URL = "http://localhost:3000/mcp";
const MODELING_URL = `http://127.0.0.1:${MODELING_PORT}/mcp`;
const TOOL_OPTIONS: ToolExecutionOptions<undefined> = {
  toolCallId: "call",
  messages: [],
  context: undefined,
};

interface LlmModule {
  getChatTools: typeof getChatTools;
  readDataContext: typeof readDataContext;
}

interface ResourceInfo {
  uri?: string;
  uriTemplate?: string;
  name: string;
  description: string;
}

interface FakeClient {
  tools: Mock<() => Promise<Record<string, unknown>>>;
  listResources: Mock<() => Promise<unknown>>;
  listResourceTemplates: Mock<() => Promise<unknown>>;
  readResource: Mock<(args: { uri: string }) => Promise<unknown>>;
}

interface ReadResourceTool {
  description: string;
  execute: (input: { uri: string }, options: ToolExecutionOptions<undefined>) => Promise<string>;
}

function fakeClient({
  resources = [],
  resourceTemplates = [],
  text = "",
}: {
  resources?: ResourceInfo[];
  resourceTemplates?: ResourceInfo[];
  text?: string;
} = {}): FakeClient {
  return {
    tools: vi.fn<() => Promise<Record<string, unknown>>>().mockResolvedValue({}),
    listResources: vi.fn<() => Promise<unknown>>().mockResolvedValue({ resources }),
    listResourceTemplates: vi.fn<() => Promise<unknown>>().mockResolvedValue({ resourceTemplates }),
    readResource: vi
      .fn<(args: { uri: string }) => Promise<unknown>>()
      .mockResolvedValue({ contents: [{ uri: "x", text }] }),
  };
}

function dataClient(): FakeClient {
  return fakeClient({
    resources: [
      { uri: "vease://data", name: "data", description: "Loaded objects" },
      { uri: "vease://viewer", name: "viewer", description: "Viewer state" },
    ],
    resourceTemplates: [
      { uriTemplate: "vease://data/{id}", name: "data-item", description: "One object" },
    ],
    text: '{"data":[]}',
  });
}

async function loadLlm(
  clients: Record<string, FakeClient>,
  extensionPorts = false,
): Promise<LlmModule> {
  vi.resetModules();
  const mcp = await import("@ai-sdk/mcp");
  // oxlint-disable-next-line require-await -- mockImplementation must return a promise, like the real client factory
  vi.mocked(mcp.createMCPClient).mockImplementation(async ({ transport }) => {
    // oxlint-disable-next-line no-unsafe-type-assertion -- the http transport config carries the url
    const { url } = transport as { url: string };
    const client = clients[url];
    if (client === undefined) {
      throw new Error(`unreachable ${url}`);
    }
    // oxlint-disable-next-line no-unsafe-type-assertion -- the fake client only implements the members the chat uses
    return client as unknown as Awaited<ReturnType<typeof mcp.createMCPClient>>;
  });
  const config = await import("@ogw_server/utils/server_config");
  vi.mocked(config.getAppBaseUrl).mockReturnValue("http://localhost:3000");
  vi.mocked(config.getExtensionServerPorts).mockReturnValue(
    new Map(extensionPorts ? [["modeling", MODELING_PORT]] : []),
  );
  return import("@vease_server/utils/llm");
}

async function readResourceTool(
  llm: Awaited<ReturnType<typeof loadLlm>>,
): Promise<ReadResourceTool> {
  const tools = await llm.getChatTools();
  // oxlint-disable-next-line no-unsafe-type-assertion -- the synthetic tool is built by createReadResourceTool with exactly this shape
  return tools["read-resource"] as unknown as ReadResourceTool;
}

describe("the LLM server utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("the getChatModel helper", () => {
    test("defaults to the local llama provider and passes its API key to the provider", async () => {
      const model = await getChatModel();

      expect(runLlamaServer).toHaveBeenCalledWith({ model: undefined });
      expect(createOpenAICompatible).toHaveBeenCalledWith({
        name: "llama-cpp",
        baseURL: "http://127.0.0.1:8080/v1",
        apiKey: "test-llama-api-key-12345",
      });
      expect(createGateway).not.toHaveBeenCalled();
      expect(model).toStrictEqual({ modelId: "llama-3-8b" });
    });

    test("forwards the requested model to the llama server", async () => {
      await getChatModel({ provider: CHAT_PROVIDER.LLAMA, model: "custom-model" });

      expect(runLlamaServer).toHaveBeenCalledWith({ model: "custom-model" });
    });

    test("uses the AI gateway with the default model when the gateway provider is selected", async () => {
      const model = await getChatModel({
        provider: CHAT_PROVIDER.GATEWAY,
        gatewayApiKey: "gateway-key",
      });

      expect(createGateway).toHaveBeenCalledWith({ apiKey: "gateway-key" });
      expect(runLlamaServer).not.toHaveBeenCalled();
      expect(model).toStrictEqual({ modelId: "openai/gpt-4o-mini" });
    });

    test("uses the requested gateway model when one is given", async () => {
      const model = await getChatModel({
        provider: CHAT_PROVIDER.GATEWAY,
        model: "anthropic/claude",
        gatewayApiKey: "gateway-key",
      });

      expect(model).toStrictEqual({ modelId: "anthropic/claude" });
    });

    test.each([undefined, ""])(
      "rejects the gateway provider when the API key is %j",
      async (gatewayApiKey) => {
        await expect(
          getChatModel({ provider: CHAT_PROVIDER.GATEWAY, gatewayApiKey }),
        ).rejects.toThrow("Missing AI Gateway key for this request");
        expect(createGateway).not.toHaveBeenCalled();
      },
    );
  });

  describe("the getChatTools helper", () => {
    test("connects once to the MCP server and returns its tool definitions", async () => {
      const tools = await getChatTools();
      await getChatTools();

      expect(createMCPClient).toHaveBeenCalledExactlyOnceWith({
        transport: { type: "http", url: "http://localhost:3000/mcp" },
      });
      expect(tools).toStrictEqual({ search_tools: {} });
    });
  });

  describe("the resources exposed to the chat", () => {
    test("adds a read-resource tool listing every resource and template", async () => {
      const llm = await loadLlm({ [DATA_URL]: dataClient() });

      const tool = await readResourceTool(llm);

      expect(tool.description).toContain("Read application state. Available resources:");
      expect(tool.description).toContain("- vease://data: Loaded objects");
      expect(tool.description).toContain("- vease://viewer: Viewer state");
      expect(tool.description).toContain("- vease://data/{id}: One object");
    });

    test("routes a templated uri to the client that declared it", async () => {
      const modeling = fakeClient({
        resourceTemplates: [
          {
            uriTemplate: "vease-modeling://horizon-stack/{id}",
            name: "stack",
            description: "A horizon stack",
          },
        ],
        text: "stack-json",
      });
      const data = dataClient();
      const llm = await loadLlm({ [DATA_URL]: data, [MODELING_URL]: modeling }, true);

      const tool = await readResourceTool(llm);
      const result = await tool.execute(
        { uri: "vease-modeling://horizon-stack/abc" },
        TOOL_OPTIONS,
      );

      expect(modeling.readResource).toHaveBeenCalledWith({
        uri: "vease-modeling://horizon-stack/abc",
      });
      expect(data.readResource).not.toHaveBeenCalled();
      expect(result).toBe("stack-json");
    });

    test("returns an unknown-resource message listing what exists", async () => {
      const llm = await loadLlm({ [DATA_URL]: dataClient() });

      const tool = await readResourceTool(llm);
      const result = await tool.execute({ uri: "vease://nope" }, TOOL_OPTIONS);

      expect(result).toBe(
        'Unknown resource "vease://nope". Available: vease://data, vease://viewer, vease://data/{id}',
      );
    });

    test("returns an error message when the read fails", async () => {
      const data = dataClient();
      data.readResource.mockRejectedValue(new Error("boom"));
      const llm = await loadLlm({ [DATA_URL]: data });

      const tool = await readResourceTool(llm);

      await expect(tool.execute({ uri: "vease://data" }, TOOL_OPTIONS)).resolves.toBe(
        "Error reading vease://data: boom",
      );
    });

    test("omits read-resource when no client has resources", async () => {
      const llm = await loadLlm({ [DATA_URL]: fakeClient() });

      const tools = await llm.getChatTools();

      expect(tools).not.toHaveProperty("read-resource");
    });

    test("still returns tools when one client fails to list resources", async () => {
      const broken = fakeClient();
      broken.tools.mockResolvedValue({ broken_tool: {} });
      broken.listResources.mockRejectedValue(new Error("no resources"));
      const llm = await loadLlm({ [DATA_URL]: dataClient(), [MODELING_URL]: broken }, true);

      const tools = await llm.getChatTools();

      expect(tools).toHaveProperty("broken_tool");
      expect(tools).toHaveProperty("read-resource");
    });

    test("reuses the client across calls when listing resources fails", async () => {
      const broken = fakeClient();
      broken.listResources.mockRejectedValue(new Error("no resources capability"));
      const llm = await loadLlm({ [DATA_URL]: broken });
      const mcp = await import("@ai-sdk/mcp");

      await llm.getChatTools();
      await llm.getChatTools();

      expect(mcp.createMCPClient).toHaveBeenCalledExactlyOnceWith({
        transport: { type: "http", url: DATA_URL },
      });
    });

    test("readDataContext returns the text of vease://data", async () => {
      const llm = await loadLlm({ [DATA_URL]: dataClient() });

      await expect(llm.readDataContext()).resolves.toBe('{"data":[]}');
    });

    test("readDataContext returns undefined when the read fails", async () => {
      const data = dataClient();
      data.readResource.mockRejectedValue(new Error("boom"));
      const llm = await loadLlm({ [DATA_URL]: data });

      await expect(llm.readDataContext()).resolves.toBeUndefined();
    });
  });
});
