import { resetPassword, useAuth } from "@vease/composables/auth";

function getFriendlyErrorMessage(error) {
  const code = String(error.code || "").toLowerCase();
  const message = String(error.message || "").toLowerCase();
  const fullError = `${code} ${message}`;

  if (
    fullError.includes("invalid-credential") ||
    fullError.includes("user-not-found") ||
    fullError.includes("wrong-password")
  ) {
    return "Invalid email address or password.";
  }
  if (fullError.includes("email-already-in-use")) {
    return "This email is already registered.";
  }
  if (fullError.includes("weak-password")) {
    return "Password should be at least 6 characters.";
  }
  if (fullError.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (fullError.includes("user-disabled")) {
    return "This account has been disabled.";
  }
  if (fullError.includes("too-many-requests")) {
    return "Too many failed attempts. Please try again later.";
  }
  if (fullError.includes("network-request-failed")) {
    return "Network error. Please check your connection.";
  }

  return error.message || "An error occurred. Please try again.";
}

// oxlint-disable-next-line max-lines-per-function
export function useAuthPage() {
  const { login, register } = useAuth();
  const router = useRouter();

  const isLogin = ref(true);
  const loading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  const email = ref("");
  const password = ref("");
  const confirmPassword = ref("");

  const showForgotPassword = ref(false);
  const forgotPasswordEmail = ref("");
  const forgotPasswordLoading = ref(false);

  async function onSubmit() {
    errorMessage.value = "";
    successMessage.value = "";

    if (!isLogin.value && password.value !== confirmPassword.value) {
      errorMessage.value = "Passwords do not match";
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
    } catch (error) {
      errorMessage.value = getFriendlyErrorMessage(error);
    } finally {
      loading.value = false;
    }
  }

  async function handleForgotPassword() {
    if (!forgotPasswordEmail.value) {
      return;
    }
    forgotPasswordLoading.value = true;
    try {
      await resetPassword(forgotPasswordEmail.value);
      successMessage.value = "Password reset email sent!";
      showForgotPassword.value = false;
    } catch (error) {
      errorMessage.value = getFriendlyErrorMessage(error);
    } finally {
      forgotPasswordLoading.value = false;
    }
  }

  function toggleMode() {
    isLogin.value = !isLogin.value;
    errorMessage.value = "";
    successMessage.value = "";
  }

  return {
    isLogin,
    loading,
    error: errorMessage,
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
