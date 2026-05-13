import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useFirebaseAuth } from "vuefire";

export function useAuth() {
  const auth = useFirebaseAuth();
  const user = useCurrentUser();

  async function register(email, password) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(newUser);
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

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  return { user, register, login, logout, resetPassword };
}
