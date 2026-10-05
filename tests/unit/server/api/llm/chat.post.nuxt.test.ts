import { CHAT_PROVIDER, getChatModel, getChatTools } from "@vease_server/utils/llm";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { consola } from "consola";
import { eventWithBody } from "@vease_tests/utils/server_utils";
import { getResponseStatus } from "h3";
import handler from "@vease_server/api/llm/chat.post";

vi.setConfig({ testTimeout: 10_000 });

const RESPONSE_OK = 200;
const INTERNAL_SERVER_ERROR = 500;
const MAX_TOOL_STEPS = 5;

vi.mock(import("@vease_server/utils/llm"), async (importOriginal) => ({
  ...(await importOriginal()),
  getChatModel: vi.fn<typeof getChatModel>(),
  getChatTools: vi.fn<typeof getChatTools>(),
}));

const { streamTextMock } = vi.hoisted(() => ({
  streamTextMock: vi.fn<(options: unknown) => { stream: string }>(() => ({
    stream: "the-stream",
  })),
}));

vi.mock(import("ai"), async (importOriginal) => {
  const actual = await importOriginal();
  const mocked = {
    ...actual,
    convertToModelMessages: vi.fn<(messages: unknown) => unknown>((messages) => messages),
    createUIMessageStreamResponse: vi.fn<(options: unknown) => Response>(
      () => new Response(undefined, { status: RESPONSE_OK }),
    ),
    stepCountIs: vi.fn<(count: number) => unknown>((count) => ({ type: "step-count", count })),
    streamText: streamTextMock,
    toUIMessageStream: vi.fn<(options: { stream: unknown }) => unknown>(({ stream }) => stream),
  };
  // The "ai" package's exports (convertToModelMessages, etc.) have large generic
  // Overload sets; these vi.fn mocks only implement the narrow shapes this
  // Codebase actually calls.
  // oxlint-disable-next-line no-unsafe-type-assertion -- mock can't reproduce ai's full generic overload set
  return mocked as unknown as typeof actual;
});

describe("the POST /api/llm/chat endpoint", () => {
  const fakeModel = { modelId: "llama-3-8b" };
  const fakeTools = { search_tools: {} };

  beforeEach(() => {
    vi.spyOn(consola, "error").mockReturnValue(undefined);
    vi.mocked(getChatModel).mockResolvedValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
      fakeModel as unknown as Awaited<ReturnType<typeof getChatModel>>,
    );
    vi.mocked(getChatTools).mockResolvedValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
      fakeTools as unknown as Awaited<ReturnType<typeof getChatTools>>,
    );
  });

  test("streams a response built from the request's messages, model and tools", async () => {
    const messages = [{ role: "user", parts: [{ type: "text", text: "hi" }] }];

    const response = await handler(eventWithBody({ messages }));

    expect(getChatModel).toHaveBeenCalledWith({
      provider: undefined,
      model: undefined,
      gatewayApiKey: undefined,
    });
    expect(getChatTools).toHaveBeenCalledWith();
    expect(streamTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: fakeModel,
        messages,
        tools: fakeTools,
        stopWhen: { type: "step-count", count: MAX_TOOL_STEPS },
      }),
    );
    expect(response).toBeInstanceOf(Response);
  });

  test("forwards the requested provider, model and gateway key to the model factory", async () => {
    const messages = [{ role: "user", parts: [{ type: "text", text: "hi" }] }];

    await handler(
      eventWithBody({
        messages,
        provider: CHAT_PROVIDER.GATEWAY,
        model: "openai/gpt-4o",
        gatewayApiKey: "gateway-key",
      }),
    );

    expect(getChatModel).toHaveBeenCalledWith({
      provider: CHAT_PROVIDER.GATEWAY,
      model: "openai/gpt-4o",
      gatewayApiKey: "gateway-key",
    });
  });

  test("turns a downstream failure into a 500 error response", async () => {
    vi.mocked(getChatModel).mockRejectedValue(new Error("model unavailable"));

    const event = eventWithBody({ messages: [] });
    await expect(handler(event)).resolves.toStrictEqual({
      code: INTERNAL_SERVER_ERROR,
      name: "Internal Server Error",
      description: "model unavailable",
    });
    expect(getResponseStatus(event)).toBe(INTERNAL_SERVER_ERROR);
    expect(streamTextMock).not.toHaveBeenCalled();
  });
});
