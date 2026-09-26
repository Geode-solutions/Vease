import { beforeEach, describe, expect, test, vi } from "vitest";
import { computed, defineComponent, ref } from "vue";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import DeleteAccountDialog from "@vease/components/Auth/DeleteAccountDialog.vue";
import { useAuth } from "@vease/composables/auth";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

// Defined inline (instead of reusing the shared GLASS_CARD_STUB) so TypeScript infers this call's type from GlassCard.vue's own default export, which vi.mock(import(...)) checks the factory result against.
vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: defineComponent({
    name: "GlassCard",
    template: "<div class='glass-card-stub'><slot /></div>",
  }),
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
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial composable return type, see tests/unit/server/utils/data_file.nuxt.test.ts
    } as unknown as ReturnType<typeof useAuth>);
  });

  test("renders dialog content when modelValue is true", () => {
    mountWithPlugins(DeleteAccountDialog, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Delete Account");
    expect(document.body.innerHTML).toContain("Are you sure you want to delete your account?");
  });

  test("disables delete button when password input is empty", () => {
    mountWithPlugins(DeleteAccountDialog, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    });

    const submitBtn = document.body.querySelector("button[type='submit']");
    expect(submitBtn).toBeDefined();
    expect(submitBtn?.hasAttribute("disabled")).toBe(true);
  });
});
