import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { computed, ref } from "vue";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import Account from "@vease/components/Auth/Account.vue";
import { navigateTo } from "#app/composables/router";
import { useAuth } from "@vease/composables/auth";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("#app/composables/router"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    navigateTo: vi.fn<typeof navigateTo>(),
  };
});

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

vi.mock(import("@vease/components/Auth/DeleteAccountDialog.vue"), () => ({
  default: {
    name: "AuthDeleteAccountDialogStub",
    props: ["modelValue"],
    template: "<div class='delete-account-stub' />",
  },
}));

describe("account component", () => {
  const logoutMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const autoLoginMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const deleteAccountMock = vi
    .fn<(password: string) => Promise<void>>()
    .mockResolvedValue(undefined);
  const registerMock = vi.fn<() => Promise<never>>();
  const loginMock = vi.fn<() => Promise<never>>();
  const resetPasswordMock = vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined);

  beforeEach(() => {
    setupActivePinia();
    vi.mocked(useAuth).mockReturnValue({
      user: ref({ email: "user@example.com" }),
      isUserAuthenticated: computed(() => true),
      logout: logoutMock,
      autoLogin: autoLoginMock,
      deleteAccount: deleteAccountMock,
      register: registerMock,
      login: loginMock,
      resetPassword: resetPasswordMock,
    } as unknown as ReturnType<typeof useAuth>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders user email and logged as label", () => {
    const wrapper = mountWithPlugins(Account, {
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain("Logged as");
    expect(wrapper.text()).toContain("user@example.com");
  });

  test("invokes logout function when logout button is clicked", async () => {
    const wrapper = mountWithPlugins(Account, {
      attachTo: document.body,
    });

    const logoutBtn = wrapper.findAll("button").find((btn) => btn.text().includes("Logout"));
    expect(logoutBtn).toBeDefined();
    await logoutBtn?.trigger("click");

    expect(logoutMock).toHaveBeenCalledOnce();
  });

  test("navigates to root path when back to viewer button is clicked", async () => {
    const wrapper = mountWithPlugins(Account, {
      attachTo: document.body,
    });

    const backBtn = wrapper.findAll("button").find((btn) => btn.text().includes("Back to Viewer"));
    expect(backBtn).toBeDefined();
    await backBtn?.trigger("click");

    expect(navigateTo).toHaveBeenCalledWith("/");
  });

  test("opens delete account dialog when delete account button is clicked", async () => {
    const wrapper = mountWithPlugins(Account, {
      attachTo: document.body,
    });

    const deleteBtn = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Delete my account"));
    expect(deleteBtn).toBeDefined();
    await deleteBtn?.trigger("click");

    const dialogStub = wrapper.findComponent({ name: "AuthDeleteAccountDialogStub" });
    expect(dialogStub.exists()).toBe(true);
    expect(dialogStub.props("modelValue")).toBe(true);
  });
});
