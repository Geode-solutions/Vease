import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { computed, ref } from "vue";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import DeleteAccountDialog from "@vease/components/Auth/DeleteAccountDialog.vue";
import { mount } from "@vue/test-utils";
import { useAuth } from "@vease/composables/auth";

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: {
    name: "GlassCard",
    template: "<div class='glass-card-stub'><slot /></div>",
  },
}));

describe("delete account dialog component", () => {
  const deleteAccountMock = vi
    .fn<(password: string) => Promise<void>>()
    .mockResolvedValue(undefined);

  beforeEach(() => {
    setupActivePinia();
    vi.mocked(useAuth).mockReturnValue({
      deleteAccount: deleteAccountMock,
      user: ref({ email: "test@example.com" }),
      isUserAuthenticated: computed(() => true),
      autoLogin: vi.fn<() => Promise<void>>(),
      register: vi.fn<() => Promise<void>>(),
      login: vi.fn<() => Promise<void>>(),
      logout: vi.fn<() => Promise<void>>(),
      resetPassword: vi.fn<() => Promise<void>>(),
    } as unknown as ReturnType<typeof useAuth>);
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

  test("disables delete button when password input is empty", () => {
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
    expect(submitBtn).toBeDefined();
    expect(submitBtn?.hasAttribute("disabled")).toBe(true);
  });
});
