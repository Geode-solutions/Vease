import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DeleteAccountDialog from "@vease/components/Auth/DeleteAccountDialog.vue";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import * as authComposable from "@vease/composables/auth";

vi.mock("@vease/composables/auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@ogw_front/components/GlassCard.vue", () => ({
  default: {
    name: "GlassCard",
    template: "<div class='glass-card-stub'><slot /></div>",
  },
}));

describe("DeleteAccountDialog.vue", () => {
  const deleteAccountMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    setupActivePinia();
    vi.mocked(authComposable.useAuth).mockReturnValue({
      deleteAccount: deleteAccountMock,
      user: ref({ email: "test@example.com" }),
      isUserAuthenticated: computed(() => true),
      autoLogin: vi.fn(),
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      resetPassword: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders dialog content when modelValue is true", () => {
    mount(DeleteAccountDialog, {
      props: {
        modelValue: true,
      },
      global: {
        plugins: [vuetify],
      },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Delete Account");
    expect(document.body.innerHTML).toContain("Are you sure you want to delete your account?");
  });

  test("disables Delete button when password input is empty", () => {
    mount(DeleteAccountDialog, {
      props: {
        modelValue: true,
      },
      global: {
        plugins: [vuetify],
      },
      attachTo: document.body,
    });

    const submitBtn = document.body.querySelector("button[type='submit']");
    expect(submitBtn).not.toBeNull();
    expect(submitBtn?.hasAttribute("disabled")).toBe(true);
  });
});
