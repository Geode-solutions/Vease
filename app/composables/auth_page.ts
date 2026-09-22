import { useAuth } from "@vease/composables/auth";

function getErrorCode(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return "";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "";
}

function getFriendlyErrorMessage(error: unknown): string {
  const code = getErrorCode(error).toLowerCase();
  const message = getErrorMessage(error).toLowerCase();
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

  const fallbackMessage = getErrorMessage(error);
  return fallbackMessage === "" ? "An error occurred. Please try again." : fallbackMessage;
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

interface UseAuthPageReturn {
  isLogin: typeof isLogin;
  loading: typeof loading;
  error: typeof errorMessage;
  successMessage: typeof successMessage;
  email: typeof email;
  password: typeof password;
  confirmPassword: typeof confirmPassword;
  showForgotPassword: typeof showForgotPassword;
  forgotPasswordEmail: typeof forgotPasswordEmail;
  forgotPasswordLoading: typeof forgotPasswordLoading;
  onSubmit: () => Promise<void>;
  handleForgotPassword: () => Promise<void>;
  toggleMode: () => void;
}

// oxlint-disable-next-line max-lines-per-function
export function useAuthPage(): UseAuthPageReturn {
  const { login, register, resetPassword } = useAuth();

  async function onSubmit(): Promise<void> {
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

  async function handleForgotPassword(): Promise<void> {
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

  function toggleMode(): void {
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
