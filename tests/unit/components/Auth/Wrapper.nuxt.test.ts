import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { computed, ref } from "vue";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { useAuth } from "@vease/composables/auth";

import Wrapper from "@vease/components/Auth/Wrapper.vue";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

vi.mock(import("@vease/components/Auth/Login.vue"), () => ({
  default: {
    name: "AuthLoginStub",
    template: "<div class='auth-login-stub' />",
  },
}));

vi.mock(import("@vease/components/Auth/Account.vue"), () => ({
  default: {
    name: "AuthAccountStub",
    template: "<div class='auth-account-stub' />",
  },
}));

describe("wrapper component", () => {
  const isAuthenticatedRef = ref(false);

  beforeEach(() => {
    setupActivePinia();
    isAuthenticatedRef.value = false;

    vi.mocked(useAuth).mockReturnValue({
      isUserAuthenticated: computed(() => isAuthenticatedRef.value),
      user: ref<unknown>(undefined),
      logout: vi.fn<() => Promise<void>>(),
      autoLogin: vi.fn<() => Promise<void>>(),
      register: vi.fn<() => Promise<never>>(),
      login: vi.fn<() => Promise<never>>(),
      deleteAccount: vi.fn<() => Promise<void>>(),
      resetPassword: vi.fn<() => Promise<unknown>>(),
    } as unknown as ReturnType<typeof useAuth>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders login component when user is not authenticated", () => {
    isAuthenticatedRef.value = false;
    const wrapper = mountWithPlugins(Wrapper, {
      attachTo: document.body,
    });

    expect(wrapper.findComponent({ name: "AuthLoginStub" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "AuthAccountStub" }).exists()).toBe(false);
  });

  test("renders account component when user is authenticated", () => {
    isAuthenticatedRef.value = true;
    const wrapper = mountWithPlugins(Wrapper, {
      attachTo: document.body,
    });

    expect(wrapper.findComponent({ name: "AuthAccountStub" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "AuthLoginStub" }).exists()).toBe(false);
  });
});
