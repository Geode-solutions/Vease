// Third-party imports
import {
  type Auth,
  EmailAuthProvider,
  type User,
  createUserWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { appMode } from "@ogw_shared/app_mode";
import { consola } from "consola";
import { useFirebaseAuth } from "vuefire";
import { useInfraStore } from "@ogw_front/stores/infra";

// Local imports
import type { SendEmailResponse } from "@geode/cloud-api/types";
import cloud_api_schemas from "@geode/cloud-api/cloud_api_schemas.json";
import { useAPIStore } from "@ogw_front/stores/api";

interface DesktopElectronAPI {
  save_credentials: (args: { email: string; password: string }) => void;
  get_credentials: () => Promise<{
    success: boolean;
    credentials?: { email: string; password: string };
    error?: string;
  }>;
  delete_credentials: () => Promise<{ success: boolean; error?: string }>;
}

function hasDesktopElectronAPI(
  value: typeof globalThis,
): value is typeof globalThis & { electronAPI: DesktopElectronAPI } {
  return "electronAPI" in value;
}

function getDesktopElectronAPI(): DesktopElectronAPI {
  const globalScope = globalThis;
  if (!hasDesktopElectronAPI(globalScope)) {
    throw new Error("Desktop electron API is not available");
  }
  return globalScope.electronAPI;
}

interface UseAuthReturn {
  user: ReturnType<typeof useCurrentUser>;
  isUserAuthenticated: ComputedRef<boolean>;
  autoLogin: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<unknown>;
}

//oxlint-disable max-lines-per-function
function useAuth(): UseAuthReturn {
  const firebaseAuth = useFirebaseAuth();
  if (!firebaseAuth) {
    throw new Error("Firebase auth is not initialized");
  }
  const auth: Auth = firebaseAuth;
  const user = useCurrentUser();
  const APIStore = useAPIStore();
  const infraStore = useInfraStore();

  const isUserAuthenticated = computed(() => Boolean(user.value));

  async function register(email: string, password: string): Promise<User> {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    const schema = cloud_api_schemas.cloud_api.auth.send_verification;
    const params = { email };
    await APIStore.request({ schema, params });
    await signOut(auth);
    return newUser;
  }

  async function login(email: string, password: string): Promise<User> {
    const { user: loggedInUser } = await signInWithEmailAndPassword(auth, email, password);
    await loggedInUser.reload();
    if (!loggedInUser.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email address before logging in.");
    }
    if (infraStore.app_mode === appMode.DESKTOP) {
      getDesktopElectronAPI().save_credentials({
        email,
        password,
      });
    }
    return loggedInUser;
  }

  async function autoLogin(): Promise<void> {
    if (infraStore.app_mode !== appMode.DESKTOP) {
      return;
    }
    try {
      const { success, credentials, error } = await getDesktopElectronAPI().get_credentials();
      if (!success) {
        consola.error("Failed to get credentials:", error);
        return;
      }
      if (credentials) {
        const { email, password } = credentials;
        try {
          await login(email, password);
        } catch (loginError) {
          consola.error("Auto-login failed:", loginError);
          await getDesktopElectronAPI().delete_credentials();
        }
      }
    } catch (error) {
      consola.error("Failed to get credentials:", error);
    }
  }

  async function logout(): Promise<void> {
    if (infraStore.app_mode === appMode.DESKTOP) {
      try {
        const { success } = await getDesktopElectronAPI().delete_credentials();
        if (!success) {
          consola.error("Failed to delete credentials");
          return;
        }
      } catch (error) {
        consola.error("Failed to delete credentials:", error);
      }
    }
    await signOut(auth);
  }

  async function deleteAccount(password: string): Promise<void> {
    const currentUser = user.value;
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    // Re-authenticate before deleting (required by Identity Platform)
    const credential = EmailAuthProvider.credential(currentUser.email ?? "", password);
    await reauthenticateWithCredential(currentUser, credential);

    await deleteUser(currentUser);
    await logout();
  }

  async function resetPassword(email: string): Promise<SendEmailResponse> {
    const schema = cloud_api_schemas.cloud_api.auth.send_password_reset;
    const params = { email };
    try {
      return await APIStore.request<SendEmailResponse>(
        { schema, params },
        { skip_feedback_error: true },
      );
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        throw error;
      }
      throw new Error("Failed to send password reset email.", { cause: error });
    }
  }
  return {
    user,
    isUserAuthenticated,
    autoLogin,
    deleteAccount,
    register,
    login,
    logout,
    resetPassword,
  };
}
export { useAuth };
