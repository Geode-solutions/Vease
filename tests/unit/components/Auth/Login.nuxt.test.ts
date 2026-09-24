import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { ref } from "vue";
import { useAuthPage } from "@vease/composables/auth_page";

import Login from "@vease/components/Auth/Login.vue";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/assets/img/logo.png"), () => ({
  default: "logo-mock.png",
}));

vi.mock(import("@vease/composables/auth_page"), () => ({
  useAuthPage: vi.fn<typeof useAuthPage>(),
}));

vi.mock(import("@vease/components/Auth/Form.vue"), () => ({
  default: {
    name: "AuthFormStub",
    template: "<div class='auth-form-stub' />",
  },
}));

describe("login component", () => {
  const isLoginRef = ref(true);
  const emailRef = ref("");
  const passwordRef = ref("");

  beforeEach(() => {
    setupActivePinia();
    isLoginRef.value = true;
    emailRef.value = "";
    passwordRef.value = "";

    vi.mocked(useAuthPage).mockReturnValue({
      isLogin: isLoginRef,
      email: emailRef,
      password: passwordRef,
    } as unknown as ReturnType<typeof useAuthPage>);
  });

  test("renders vease title and login subtitle when isLogin is true", () => {
    const wrapper = mountWithPlugins(Login, {
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain("Vease");
    expect(wrapper.text()).toContain("Welcome back! Please login to your account");
    expect(wrapper.findComponent({ name: "AuthFormStub" }).exists()).toBe(true);
  });

  test("renders registration subtitle when isLogin is false", () => {
    isLoginRef.value = false;
    const wrapper = mountWithPlugins(Login, {
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain("Create an account to get started");
  });
});
