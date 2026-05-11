import { useAuth } from "@vease/composables/auth";

export function useAuthPage() {
  const { login, register, resetPassword } = useAuth();
  const router = useRouter();

  const isLogin = ref(true);
  const loading = ref(false);
  const error = ref("");
  const successMessage = ref("");

  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");

  const showForgotPassword = ref(false);
  const forgotPasswordEmail = ref("");
  const forgotPasswordLoading = ref(false);

  async function onSubmit() {
    error.value = "";
    successMessage.value = "";

    if (!isLogin.value && password.value !== confirmPassword.value) {
      error.value = "Passwords do not match";
      return;
    }

    loading.value = true;
    try {
      if (isLogin.value) {
        await login(email.value, password.value);
        router.push("/");
      } else {
        await register(email.value, password.value);
        successMessage.value = "Account created! Please check your email for verification.";
        isLogin.value = true;
        password.value = "";
        confirmPassword.value = "";
      }
    } catch (err) {
      console.error(err);
      error.value = err.message || "An error occurred";
    } finally {
      loading.value = false;
    }
  }

  async function handleForgotPassword() {
    if (!forgotPasswordEmail.value) return;
    forgotPasswordLoading.value = true;
    try {
      await resetPassword(forgotPasswordEmail.value);
      successMessage.value = "Password reset email sent!";
      showForgotPassword.value = false;
    } catch (err) {
      error.value = err.message || "Failed to send reset email";
    } finally {
      forgotPasswordLoading.value = false;
    }
  }

  function toggleMode() {
    isLogin.value = !isLogin.value;
    error.value = "";
    successMessage.value = "";
  }

  return {
    isLogin,
    loading,
    error,
    successMessage,
    email,
    password,
    confirmPassword,
    showForgotPassword,
    forgotPasswordEmail,
    forgotPasswordLoading,
    onSubmit,
    handleForgotPassword,
    toggleMode,
  };
}
