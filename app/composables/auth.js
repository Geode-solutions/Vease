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

  const isEmailVerified = computed(() => user.value?.emailVerified === true);

  async function register(email, password) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(newUser);
    await signOut(auth);
    return newUser;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  return { user, isEmailVerified, register, login, logout, resetPassword };
}
