import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import ForgotPasswordDialog from "@vease/components/Auth/ForgotPasswordDialog.vue";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: {
    name: "GlassCard",
    template: "<div class='glass-card-stub'><slot /></div>",
  },
}));

describe("forgot password dialog component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders forgot password fields", () => {
    mountWithPlugins(ForgotPasswordDialog, {
      props: {
        modelValue: true,
        email: "user@example.com",
      },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Reset Password");
    expect(document.body.innerHTML).toContain(
      "Enter your email address and we'll send you a recovery link.",
    );
  });

  test("displays error alert when error prop is provided", () => {
    mountWithPlugins(ForgotPasswordDialog, {
      props: {
        modelValue: true,
        error: "Failed to send reset email",
      },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Failed to send reset email");
  });
});
