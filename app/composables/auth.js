import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAPIStore } from "@vease/stores/api";
import { useCurrentUser, useFirebaseAuth } from "vuefire";

function useAuth() {
  const auth = useFirebaseAuth();
  const user = useCurrentUser();
  const APIStore = useAPIStore();

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

  async function login(email, password) {
    const { user: loggedInUser } = await signInWithEmailAndPassword(auth, email, password);
    await loggedInUser.reload();
    if (!loggedInUser.emailVerified) {
      await signOut(auth);
      throw new Error("Please verify your email address before logging in.");
    }
    return loggedInUser;
  }

  function logout() {
    signOut(auth);
  }

  return { user, register, login, logout, resetPassword };
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
