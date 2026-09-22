// Third-party imports
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { appMode } from "@ogw_shared/app_mode";
import { useFirebaseAuth } from "vuefire";
// oxlint-disable-next-line eslint/no-duplicate-imports
import type { Auth, User } from "firebase/auth";
import { useInfraStore } from "@ogw_front/stores/infra";

// Local imports
import { useAPIStore } from "@vease/stores/api";

interface DesktopElectronAPI {
  save_credentials: (args: Readonly<{ email: string; password: string }>) => void;
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
    const schema = {
      $id: "/auth/send-verification",
      methods: ["POST"],
      type: "object",
      properties: { email: { type: "string" } },
      required: ["email"],
      additionalProperties: false,
    };
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
        console.error("Failed to get credentials:", error);
        return;
      }
      if (credentials) {
        const { email, password } = credentials;
        try {
          await login(email, password);
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          await getDesktopElectronAPI().delete_credentials();
        }
      }
    } catch (error) {
      console.error("Failed to get credentials:", error);
    }
  }

  async function logout(): Promise<void> {
    if (infraStore.app_mode === appMode.DESKTOP) {
      try {
        const { success } = await getDesktopElectronAPI().delete_credentials();
        if (!success) {
          console.error("Failed to delete credentials");
          return;
        }
      } catch (error) {
        console.error("Failed to delete credentials:", error);
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

  async function resetPassword(email: string): Promise<unknown> {
    const schema = {
      $id: "/auth/send-password-reset",
      methods: ["POST"],
      type: "object",
      properties: { email: { type: "string" } },
      required: ["email"],
      additionalProperties: false,
    };
    const params = { email };
    const result = await APIStore.request({ schema, params });
    return result;
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
