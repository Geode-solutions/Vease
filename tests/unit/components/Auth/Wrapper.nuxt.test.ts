/* oxlint-disable eslint/sort-imports */
/* oxlint-disable vitest/prefer-called-once */
/* oxlint-disable eslint/no-magic-numbers */
import { useAuth } from "@vease/composables/auth";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { computed, ref } from "vue";

import Wrapper from "@vease/components/Auth/Wrapper.vue";

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
    const wrapper = mount(Wrapper, {
      global: {
        plugins: [vuetify],
      },
      attachTo: document.body,
    });

    expect(wrapper.findComponent({ name: "AuthLoginStub" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "AuthAccountStub" }).exists()).toBe(false);
  }, 10_000);

  test("renders account component when user is authenticated", () => {
    isAuthenticatedRef.value = true;
    const wrapper = mount(Wrapper, {
      global: {
        plugins: [vuetify],
      },
      attachTo: document.body,
    });

    expect(wrapper.findComponent({ name: "AuthAccountStub" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "AuthLoginStub" }).exists()).toBe(false);
  }, 10_000);
});
