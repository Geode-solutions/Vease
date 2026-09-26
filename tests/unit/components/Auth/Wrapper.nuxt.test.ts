import { beforeEach, describe, expect, test, vi } from "vitest";
import { computed, defineComponent, ref } from "vue";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { useAuth } from "@vease/composables/auth";

import Wrapper from "@vease/components/Auth/Wrapper.vue";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

vi.mock(import("@vease/components/Auth/Login.vue"), () => ({
  default: defineComponent({
    name: "AuthLoginStub",
    template: "<div class='auth-login-stub' />",
  }),
}));

vi.mock(import("@vease/components/Auth/Account.vue"), () => ({
  default: defineComponent({
    name: "AuthAccountStub",
    template: "<div class='auth-account-stub' />",
  }),
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
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial composable return type, see tests/unit/server/utils/data_file.nuxt.test.ts
    } as unknown as ReturnType<typeof useAuth>);
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
