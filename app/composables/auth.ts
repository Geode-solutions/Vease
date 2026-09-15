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
import type { Auth } from "firebase/auth";
import { useInfraStore } from "@ogw_front/stores/infra";

// Local imports
import { useAPIStore } from "@vease/stores/api";

//oxlint-disable max-lines-per-function
function useAuth() {
  const firebaseAuth = useFirebaseAuth();
  if (!firebaseAuth) {
    throw new Error("Firebase auth is not initialized");
  }
  const auth: Auth = firebaseAuth;
  const user = useCurrentUser();
  const APIStore = useAPIStore();
  const infraStore = useInfraStore();

  const isUserAuthenticated = computed(() => Boolean(user.value));

  async function register(email: string, password: string) {
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

  async function login(email: string, password: string) {
    const { user: loggedInUser } = await signInWithEmailAndPassword(auth, email, password);
    await loggedInUser.reload();
    if (!loggedInUser.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email address before logging in.");
    }
    if (infraStore.app_mode === appMode.DESKTOP) {
      globalThis.electronAPI.save_credentials({
        email,
        password,
      });
    }
    return loggedInUser;
  }

  async function autoLogin() {
    if (infraStore.app_mode !== appMode.DESKTOP) {
      return;
    }
    try {
      const { success, credentials, error } = await globalThis.electronAPI.get_credentials();
      if (!success) {
        console.error("Failed to get credentials:", error);
        return;
      }
      if (credentials) {
        const { email, password } = credentials;
        try {
          return login(email, password);
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          return globalThis.electronAPI.delete_credentials();
        }
      }
    } catch (error) {
      console.error("Failed to get credentials:", error);
    }
  }

  async function logout() {
    if (infraStore.app_mode === appMode.DESKTOP) {
      try {
        const { success } = await globalThis.electronAPI.delete_credentials();
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

  async function deleteAccount(password: string) {
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

  function resetPassword(email: string) {
    const schema = {
      $id: "/auth/send-password-reset",
      methods: ["POST"],
      type: "object",
      properties: { email: { type: "string" } },
      required: ["email"],
      additionalProperties: false,
    };
    const params = { email };
    return APIStore.request({ schema, params });
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
