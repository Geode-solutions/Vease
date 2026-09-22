import { useAuth } from "@vease/composables/auth";

const ERROR_MESSAGE_MAP: [string[], string][] = [
  [["not associated", "user-not-found"], "This email is not associated with an account."],
  [["invalid-credential", "wrong-password"], "Invalid email address or password."],
  [["email-already-in-use"], "This email is already registered."],
  [["weak-password"], "Password should be at least 6 characters."],
  [["invalid-email"], "Please enter a valid email address."],
  [["user-disabled"], "This account has been disabled."],
  [["too-many-requests"], "Too many failed attempts. Please try again later."],
  [["network-request-failed"], "Network error. Please check your connection."],
];

function extractApiError(error: Record<string, unknown> | null | undefined): string {
  if (!error) {
    return "";
  }
  const data = error.data as Record<string, unknown> | undefined;
  const response = error.response as { _data?: Record<string, unknown> } | undefined;
  const resData = response?._data;

  const errVal = data?.error || resData?.error || data?.message || resData?.message;
  return typeof errVal === "string" ? errVal : "";
}

function getFriendlyErrorMessage(error: unknown) {
  const errObj = error as Record<string, unknown> | null | undefined;
  const apiError = extractApiError(errObj);
  const code = String(errObj?.code || "").toLowerCase();
  const message = String(errObj?.message || "").toLowerCase();
  const fullError = `${code} ${message} ${apiError.toLowerCase()}`;

  for (const [patterns, friendlyMessage] of ERROR_MESSAGE_MAP) {
    if (patterns.some((pattern) => fullError.includes(pattern))) {
      return friendlyMessage;
    }
  }

  if (apiError && !apiError.startsWith("[POST]")) {
    return apiError;
  }

  return "An error occurred. Please try again.";
}

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
const forgotPasswordError = ref("");

// oxlint-disable-next-line max-lines-per-function
export function useAuthPage() {
  const { login, register, resetPassword } = useAuth();

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
      password.value = "";
      confirmPassword.value = "";
    }
  }

  async function handleForgotPassword() {
    if (!forgotPasswordEmail.value) {
      return;
    }
    forgotPasswordLoading.value = true;
    forgotPasswordError.value = "";
    errorMessage.value = "";
    successMessage.value = "";
    try {
      await resetPassword(forgotPasswordEmail.value);
      successMessage.value = "Password reset email sent!";
      showForgotPassword.value = false;
    } catch (error) {
      forgotPasswordError.value = getFriendlyErrorMessage(error);
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
    forgotPasswordError,
    onSubmit,
    handleForgotPassword,
    toggleMode,
  };
}
