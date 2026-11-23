import {
  CHAT_PROVIDER,
  chatPipMocks,
  findButton,
  mockAuth,
  mockChat,
} from "@vease_tests/utils/chat_pip_harness";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ChatPiP from "@vease/components/chat/ChatPiP.vue";
import type ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import type { useAuth } from "@vease/composables/auth";
import type { useVeaseChat } from "@vease/composables/chat";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/components/Layout/ResizablePiP.vue"), () => ({
  // oxlint-disable-next-line no-unsafe-type-assertion -- stub only implements the subset of ResizablePiP this suite touches; defineComponent() can't be used here as it would reference the "vue" import from inside the hoisted vi.mock factory, which breaks at runtime
  default: {
    name: "ResizablePiP",
    props: [
      "storageKey",
      "escapeFunction",
      "defaultWidth",
      "defaultHeight",
      "minWidth",
      "minHeight",
    ],
    template: "<div class='resizable-pip-stub'><slot name='handle' /><slot /></div>",
  } as unknown as typeof ResizablePiP,
}));

vi.mock(import("@vease/composables/chat"), () => ({
  useVeaseChat: vi.fn<typeof useVeaseChat>(),
}));

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

describe("the ChatPiP provider controls", () => {
  beforeEach(() => {
    setupActivePinia();
    vi.clearAllMocks();
    mockAuth(true);
    mockChat();
  });

  describe("the provider switch", () => {
    test("locks the cloud provider when the account is not entitled", async () => {
      const wrapper = mountWithPlugins(ChatPiP);

      const cloudBtn = wrapper.find('[data-testid="chatProvider-gateway"]');
      expect(cloudBtn.attributes("disabled")).toBeDefined();
      await cloudBtn.trigger("click");

      expect(chatPipMocks.setProvider).not.toHaveBeenCalled();
    });

    test("explains why the cloud AI is locked behind the info button", async () => {
      const wrapper = mountWithPlugins(ChatPiP);

      await wrapper.find('[data-testid="chatProviderInfoButton"]').trigger("click");

      expect(wrapper.find('[data-testid="cloudUnavailableMessage"]').text()).toContain(
        "authorized accounts",
      );
    });

    test("selects the cloud provider when it is allowed", async () => {
      mockChat({ cloudUnavailableReason: undefined });
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="cloudUnavailableMessage"]').exists()).toBe(false);
      await wrapper.find('[data-testid="chatProvider-gateway"]').trigger("click");

      expect(chatPipMocks.setProvider).toHaveBeenCalledWith(CHAT_PROVIDER.GATEWAY);
    });

    test("describes the providers only on demand", async () => {
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="chatProviderInfo"]').exists()).toBe(false);
      await wrapper.find('[data-testid="chatProviderInfoButton"]').trigger("click");

      const info = wrapper.find('[data-testid="chatProviderInfo"]').text();
      expect(info).toContain("Runs on this computer");
      expect(info).toContain("messages are sent online");
    });
  });

  describe("with the local provider", () => {
    test("tells that the local model starts with the first message", () => {
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="localModelStatus"]').text()).toContain(
        "Starts with your first message",
      );
      expect(wrapper.findAll("button").some((btn) => btn.text().includes("Stop"))).toBe(false);
    });

    test("explains the wait while the local model starts", () => {
      mockChat({ status: "submitted", llamaStarting: true });

      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="localModelStatus"]').text()).toContain(
        "Starting local model",
      );
      expect(wrapper.find('[data-testid="chatPendingAnswer"]').text()).toContain(
        "can take a few minutes",
      );
    });

    test("stops a running local model when the stop button is clicked", async () => {
      mockChat({ llamaRunning: true });
      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.text()).toContain("Local model ready");
      await findButton(wrapper, "Stop").trigger("click");

      expect(chatPipMocks.killLlamaServer).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe("with the cloud provider", () => {
    test("hides the local model status", () => {
      mockChat({
        provider: CHAT_PROVIDER.GATEWAY,
        cloudUnavailableReason: undefined,
        llamaRunning: true,
      });

      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="localModelStatus"]').exists()).toBe(false);
    });

    test("shows a plain pending answer", () => {
      mockChat({
        provider: CHAT_PROVIDER.GATEWAY,
        cloudUnavailableReason: undefined,
        status: "submitted",
      });

      const wrapper = mountWithPlugins(ChatPiP);

      expect(wrapper.find('[data-testid="chatPendingAnswer"]').text()).toContain("Thinking");
    });
  });
});
