import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { ref } from "vue";
import { useAuthPage } from "@vease/composables/auth_page";

import Form from "@vease/components/Auth/Form.vue";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/composables/auth_page"), () => ({
  useAuthPage: vi.fn<typeof useAuthPage>(),
}));

vi.mock(import("@vease/components/Auth/ForgotPasswordDialog.vue"), () => ({
  default: {
    name: "AuthForgotPasswordDialogStub",
    props: ["modelValue", "email", "loading", "error"],
    template: "<div class='forgot-password-stub' />",
  },
}));

describe("form component", () => {
  const isLoginRef = ref(true);
  const loadingRef = ref(false);
  const errorRef = ref("");
  const successMessageRef = ref("");
  const emailRef = ref("");
  const passwordRef = ref("");
  const confirmPasswordRef = ref("");
  const showForgotPasswordRef = ref(false);
  const forgotPasswordEmailRef = ref("");
  const forgotPasswordLoadingRef = ref(false);
  const forgotPasswordErrorRef = ref("");

  const onSubmitMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const handleForgotPasswordMock = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const toggleModeMock = vi.fn<() => void>();

  beforeEach(() => {
    setupActivePinia();
    isLoginRef.value = true;
    loadingRef.value = false;
    errorRef.value = "";
    successMessageRef.value = "";
    emailRef.value = "";
    passwordRef.value = "";
    confirmPasswordRef.value = "";
    showForgotPasswordRef.value = false;
    forgotPasswordEmailRef.value = "";
    forgotPasswordLoadingRef.value = false;
    forgotPasswordErrorRef.value = "";

    vi.mocked(useAuthPage).mockReturnValue({
      isLogin: isLoginRef,
      loading: loadingRef,
      error: errorRef,
      successMessage: successMessageRef,
      email: emailRef,
      password: passwordRef,
      confirmPassword: confirmPasswordRef,
      showForgotPassword: showForgotPasswordRef,
      forgotPasswordEmail: forgotPasswordEmailRef,
      forgotPasswordLoading: forgotPasswordLoadingRef,
      forgotPasswordError: forgotPasswordErrorRef,
      onSubmit: onSubmitMock,
      handleForgotPassword: handleForgotPasswordMock,
      toggleMode: toggleModeMock,
    });
  });

  test("renders login form elements by default", () => {
    const wrapper = mountWithPlugins(Form, {
      attachTo: document.body,
    });

    expect(wrapper.find("[data-testid='eMailInput']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='passwordInput']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='signInButton']").text()).toContain("Sign In");
    expect(wrapper.text()).toContain("Forgot your password?");
    expect(wrapper.text()).toContain("Create an account");
  });

  test("renders registration fields when isLogin is false", () => {
    isLoginRef.value = false;
    const wrapper = mountWithPlugins(Form, {
      attachTo: document.body,
    });

    expect(wrapper.find("[data-testid='signInButton']").text()).toContain("Get Started");
    expect(wrapper.text()).toContain("Confirm Password");
    expect(wrapper.text()).toContain("Log in");
  });

  test("invokes toggleMode when mode toggle button is clicked", async () => {
    const wrapper = mountWithPlugins(Form, {
      attachTo: document.body,
    });

    const toggleBtn = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Create an account"));
    expect(toggleBtn).toBeDefined();
    await toggleBtn?.trigger("click");

    // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
    expect(toggleModeMock).toHaveBeenCalledOnce();
  });

  test("opens forgot password dialog when forgot password button is clicked", async () => {
    const wrapper = mountWithPlugins(Form, {
      attachTo: document.body,
    });

    const forgotBtn = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("Forgot your password?"));
    expect(forgotBtn).toBeDefined();
    await forgotBtn?.trigger("click");

    expect(showForgotPasswordRef.value).toBe(true);
  });

  test("renders error and success alerts when message refs are populated", () => {
    errorRef.value = "Invalid email or password.";
    successMessageRef.value = "Account registered successfully!";
    const wrapper = mountWithPlugins(Form, {
      attachTo: document.body,
    });

    expect(wrapper.text()).toContain("Invalid email or password.");
    expect(wrapper.text()).toContain("Account registered successfully!");
  });
});
