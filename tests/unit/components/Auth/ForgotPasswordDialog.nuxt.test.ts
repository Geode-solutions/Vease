import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ForgotPasswordDialog from "@vease/components/Auth/ForgotPasswordDialog.vue";
import { setupActivePinia, vuetify } from "@vease_tests/utils";

vi.mock("@ogw_front/components/GlassCard.vue", () => ({
  default: {
    name: "GlassCard",
    template: "<div class='glass-card-stub'><slot /></div>",
  },
}));

describe("ForgotPasswordDialog.vue", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders forgot password fields", () => {
    mount(ForgotPasswordDialog, {
      props: {
        modelValue: true,
        email: "user@example.com",
      },
      global: {
        plugins: [vuetify],
      },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Reset Password");
    expect(document.body.innerHTML).toContain(
      "Enter your email address and we'll send you a recovery link.",
    );
  });

  test("displays error alert when error prop is provided", () => {
    mount(ForgotPasswordDialog, {
      props: {
        modelValue: true,
        error: "Failed to send reset email",
      },
      global: {
        plugins: [vuetify],
      },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Failed to send reset email");
  });
});
