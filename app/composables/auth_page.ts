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

function getField(value: unknown, key: string): unknown {
  if (typeof value !== "object" || value === null || !(key in value)) {
    return undefined;
  }
  const field: unknown = Reflect.get(value, key);
  return field;
}

function extractApiError(error: unknown): string {
  const data = getField(error, "data");
  const responseData = getField(getField(error, "response"), "_data");
  const candidates = [
    getField(data, "error"),
    getField(responseData, "error"),
    getField(data, "message"),
    getField(responseData, "message"),
  ];
  const apiError = candidates.find(
    (candidate): candidate is string => typeof candidate === "string" && candidate !== "",
  );
  return apiError ?? "";
}

function getFriendlyErrorMessage(error: unknown): string {
  const apiError = extractApiError(error);
  const code = getErrorCode(error).toLowerCase();
  const message = getErrorMessage(error).toLowerCase();
  const fullError = `${code} ${message} ${apiError.toLowerCase()}`;

  for (const [patterns, friendlyMessage] of ERROR_MESSAGE_MAP) {
    if (patterns.some((pattern) => fullError.includes(pattern))) {
      return friendlyMessage;
    }
  }

  if (apiError && !apiError.startsWith("[POST]")) {
    return apiError;
  }

  const fallbackMessage = getErrorMessage(error);
  return fallbackMessage === "" || fallbackMessage.startsWith("[POST]")
    ? "An error occurred. Please try again."
    : fallbackMessage;
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
  forgotPasswordError: typeof forgotPasswordError;
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
    forgotPasswordError,
    onSubmit,
    handleForgotPassword,
    toggleMode,
  };
}
