// Third-party imports
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { appMode } from "@ogw_front/utils/local/app_mode";
import { useFirebaseAuth } from "vuefire";
import { useInfraStore } from "@ogw_front/stores/infra";

// Local imports
import { useAPIStore } from "@vease/stores/api";

function useAuth() {
  const auth = useFirebaseAuth();
  const user = useCurrentUser();
  const APIStore = useAPIStore();
  const infraStore = useInfraStore();

  async function register(email, password) {
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

  async function autoLogin() {
    console.log("Attempting to retrieve credentials for auto-login");
    if (infraStore.app_mode !== appMode.DESKTOP) {
      return;
    }
    try {
      const { success, credentials, error } = await globalThis.electronAPI.get_credentials();
      if (!success) {
        console.error("Failed to get credentials:", error);
        return;
      }
      console.log("Credentials retrieval successful", { credentials });
      if (credentials) {
        const { email, password } = credentials;
        try {
          console.log("Attempting auto-login with retrieved credentials", { email, password });
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

  async function login(email, password) {
    const { user: loggedInUser } = await signInWithEmailAndPassword(auth, email, password);
    await loggedInUser.reload();
    if (!loggedInUser.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email address before logging in.");
    }
    if (infraStore.app_mode === appMode.DESKTOP) {
      console.log("Saving credentials for desktop mode");
      globalThis.electronAPI.save_credentials({
        email,
        password,
      });
    }
    return loggedInUser;
  }

  async function deleteAccount() {
    if (!user.value) throw new Error('No user logged in')
    await deleteUser(user.value)
    await signOut(auth)
  }
  function logout() {
    try {
      const { success } = await globalThis.electronAPI.delete_credentials();
      if (!success) {
        console.error("Failed to delete credentials:", error);
        return;
      }
      console.log("Credentials deletion successful");
    } catch (error) {
      console.error("Failed to delete credentials:", error);
    }
    signOut(auth);
  }
  return { user, autoLogin, deleteAccount, register, login, logout, resetPassword };

}
try {
  console.log("Attempting auto-login with retrieved credentials", { email, password });
  return login(email, password);
} catch (loginError) {
  console.error("Auto-login failed:", loginError);
  return globalThis.electronAPI.delete_credentials();
}
      }
    } catch (error) {
  console.error("Failed to get credentials:", error);
}
signOut(auth);
  }
return { user, autoLogin, deleteAccount, register, login, logout, resetPassword };


}

function resetPassword(email) {
  const APIStore = useAPIStore();
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

export { useAuth, resetPassword };
