import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

function useAuth() {
  const auth = useFirebaseAuth();
  const user = useCurrentUser();

  async function register(email, password) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await $fetch(
      "https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api/auth/send-verification",
      {
        method: "POST",
        body: { email },
      },
    );
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
  return $fetch(
    "https://europe-west9-project-98b129be-91e9-491b-8ce.cloudfunctions.net/api/auth/send-password-reset",
    {
      method: "POST",
      body: { email },
    },
  );
}

export { useAuth, resetPassword };
