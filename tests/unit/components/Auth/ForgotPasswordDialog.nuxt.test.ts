import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
// oxlint-disable-next-line eslint/sort-imports -- must run before the ForgotPasswordDialog.vue import below so `defineComponent` is initialized before that import eagerly evaluates GlassCard.vue and runs the vi.mock factory referencing it
import { defineComponent } from "vue";
// oxlint-disable-next-line eslint/sort-imports -- see the comment above the "vue" import
import ForgotPasswordDialog from "@vease/components/Auth/ForgotPasswordDialog.vue";

vi.setConfig({ testTimeout: 10_000 });

// Defined inline (instead of reusing the shared GLASS_CARD_STUB) so TypeScript infers this call's type from GlassCard.vue's own default export, which vi.mock(import(...)) checks the factory result against.
vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: defineComponent({
    name: "GlassCard",
    template: "<div class='glass-card-stub'><slot /></div>",
  }),
}));

describe("forgot password dialog component", () => {
  beforeEach(() => {
    setupActivePinia();
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
