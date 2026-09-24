import { beforeEach, describe, expect, test, vi } from "vitest";
import { useAuth } from "@vease/composables/auth";
import { useAuthPage } from "@vease/composables/auth_page";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

type UseAuthReturn = ReturnType<typeof useAuth>;
const loginMock = vi.fn<UseAuthReturn["login"]>();
const registerMock = vi.fn<UseAuthReturn["register"]>();
const resetPasswordMock = vi.fn<UseAuthReturn["resetPassword"]>();

// The composable's refs are module-level singletons; every test resets them.
function resetAuthPageState(): ReturnType<typeof useAuthPage> {
  const authPage = useAuthPage();
  authPage.isLogin.value = true;
  authPage.loading.value = false;
  authPage.error.value = "";
  authPage.successMessage.value = "";
  authPage.email.value = "";
  authPage.password.value = "";
  authPage.confirmPassword.value = "";
  authPage.showForgotPassword.value = false;
  authPage.forgotPasswordEmail.value = "";
  authPage.forgotPasswordLoading.value = false;
  return authPage;
}

describe("useAuthPage composable", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: loginMock,
      register: registerMock,
      resetPassword: resetPasswordMock,
      user: ref<{ email: string } | undefined>(undefined),
      isUserAuthenticated: computed(() => false),
      autoLogin: vi.fn<() => Promise<void>>(),
      deleteAccount: vi.fn<(password: string) => Promise<void>>(),
      logout: vi.fn<() => Promise<void>>(),
    } as unknown as ReturnType<typeof useAuth>);
    resetAuthPageState();
  });

  describe("toggleMode", () => {
    test("flips isLogin and clears messages", () => {
      const authPage = resetAuthPageState();
      authPage.error.value = "some error";
      authPage.successMessage.value = "some success";

      authPage.toggleMode();

      expect(authPage.isLogin.value).toBe(false);
      expect(authPage.error.value).toBe("");
      expect(authPage.successMessage.value).toBe("");

      authPage.toggleMode();
      expect(authPage.isLogin.value).toBe(true);
    });
  });

  describe("onSubmit in login mode", () => {
    test("logs in with the current credentials and clears the password afterwards", async () => {
      loginMock.mockResolvedValue(undefined);
      const authPage = resetAuthPageState();
      authPage.email.value = "user@example.com";
      authPage.password.value = "secret";

      await authPage.onSubmit();

      expect(loginMock).toHaveBeenCalledWith("user@example.com", "secret");
      expect(authPage.loading.value).toBe(false);
      expect(authPage.password.value).toBe("");
      expect(authPage.error.value).toBe("");
    });

    test("maps a Firebase-style error code to a friendly message", async () => {
      loginMock.mockRejectedValue({ code: "auth/wrong-password" });
      const authPage = resetAuthPageState();
      authPage.email.value = "user@example.com";
      authPage.password.value = "wrong";

      await authPage.onSubmit();

      expect(authPage.error.value).toBe("Invalid email address or password.");
      expect(authPage.loading.value).toBe(false);
    });

    test("falls back to the raw error message for an unrecognized Error", async () => {
      loginMock.mockRejectedValue(new Error("Something specific broke"));
      const authPage = resetAuthPageState();

      await authPage.onSubmit();

      expect(authPage.error.value).toBe("Something specific broke");
    });

    test("uses a generic fallback for an unrecognized, empty error", async () => {
      loginMock.mockRejectedValue({});
      const authPage = resetAuthPageState();

      await authPage.onSubmit();

      expect(authPage.error.value).toBe("An error occurred. Please try again.");
    });

    test("surfaces a nested API error message instead of the raw error", async () => {
      loginMock.mockRejectedValue({ data: { error: "Account locked" } });
      const authPage = resetAuthPageState();

      await authPage.onSubmit();

      expect(authPage.error.value).toBe("Account locked");
    });
  });

  describe("onSubmit in register mode", () => {
    test("rejects mismatched passwords without calling register", async () => {
      const authPage = resetAuthPageState();
      authPage.isLogin.value = false;
      authPage.password.value = "abc123";
      authPage.confirmPassword.value = "different";

      await authPage.onSubmit();

      expect(registerMock).not.toHaveBeenCalled();
      expect(authPage.error.value).toBe("Passwords do not match");
    });

    test("registers, shows a success message and switches back to login mode", async () => {
      registerMock.mockResolvedValue(undefined);
      const authPage = resetAuthPageState();
      authPage.isLogin.value = false;
      authPage.email.value = "new@example.com";
      authPage.password.value = "abc123";
      authPage.confirmPassword.value = "abc123";

      await authPage.onSubmit();

      expect(registerMock).toHaveBeenCalledWith("new@example.com", "abc123");
      expect(authPage.isLogin.value).toBe(true);
      expect(authPage.successMessage.value).toBe(
        "Account created! Please check your email for verification.",
      );
      expect(authPage.password.value).toBe("");
      expect(authPage.confirmPassword.value).toBe("");
    });
  });

  describe("handleForgotPassword", () => {
    test("does nothing when no email is provided", async () => {
      const authPage = resetAuthPageState();

      await authPage.handleForgotPassword();

      expect(resetPasswordMock).not.toHaveBeenCalled();
    });

    test("sends the reset email, shows a success message and closes the dialog", async () => {
      resetPasswordMock.mockResolvedValue(undefined);
      const authPage = resetAuthPageState();
      authPage.forgotPasswordEmail.value = "forgot@example.com";
      authPage.showForgotPassword.value = true;

      await authPage.handleForgotPassword();

      expect(resetPasswordMock).toHaveBeenCalledWith("forgot@example.com");
      expect(authPage.successMessage.value).toBe("Password reset email sent!");
      expect(authPage.showForgotPassword.value).toBe(false);
      expect(authPage.forgotPasswordLoading.value).toBe(false);
    });

    test("keeps the dialog open and records a friendly error on failure", async () => {
      resetPasswordMock.mockRejectedValue({ code: "auth/user-not-found" });
      const authPage = resetAuthPageState();
      authPage.forgotPasswordEmail.value = "unknown@example.com";
      authPage.showForgotPassword.value = true;

      await authPage.handleForgotPassword();

      expect(authPage.showForgotPassword.value).toBe(true);
      expect(authPage.forgotPasswordLoading.value).toBe(false);
    });
  });
});
