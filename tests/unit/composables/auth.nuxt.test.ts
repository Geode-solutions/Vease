import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia } from "@vease_tests/utils";
import { useAuth } from "@vease/composables/auth";
import * as firebaseAuth from "firebase/auth";
import * as vuefire from "vuefire";
import { useAPIStore } from "@vease/stores/api";
import { useInfraStore } from "@ogw_front/stores/infra";
import { appMode } from "@ogw_shared/app_mode";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
  reauthenticateWithCredential: vi.fn().mockResolvedValue(undefined),
  deleteUser: vi.fn().mockResolvedValue(undefined),
  EmailAuthProvider: {
    credential: vi.fn().mockReturnValue({ providerId: "password" }),
  },
}));

const mockUserRef = ref<unknown>(null);

vi.mock("vuefire", () => ({
  useFirebaseAuth: vi.fn(),
  useCurrentUser: () => mockUserRef,
}));

describe("useAuth composable", () => {
  const mockUser = {
    email: "test@example.com",
    emailVerified: true,
    reload: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    setupActivePinia();
    vi.mocked(vuefire.useFirebaseAuth).mockReturnValue({} as firebaseAuth.Auth);
    mockUserRef.value = mockUser;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("throws error if Firebase auth is not initialized", () => {
    vi.mocked(vuefire.useFirebaseAuth).mockReturnValue(null);
    expect(() => useAuth()).toThrow("Firebase auth is not initialized");
  });

  describe("resetPassword", () => {
    test("sends password reset email request successfully", async () => {
      const apiStore = useAPIStore();
      const apiSpy = vi.spyOn(apiStore, "request").mockResolvedValue({ success: true });

      const auth = useAuth();
      const result = await auth.resetPassword("test@example.com");

      expect(apiSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          schema: expect.objectContaining({
            $id: "/auth/send-password-reset",
          }),
          params: { email: "test@example.com" },
        }),
        { skip_feedback_error: true },
      );
      expect(result).toEqual({ success: true });
    });

    test("throws error if API request returns an error property", async () => {
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockResolvedValue({ error: "User not found" });

      const auth = useAuth();
      await expect(auth.resetPassword("nonexistent@example.com")).rejects.toThrow("User not found");
    });
  });

  describe("register", () => {
    test("creates user, sends verification email, and signs out", async () => {
      const newUserMock = { email: "new@example.com" };
      vi.mocked(firebaseAuth.createUserWithEmailAndPassword).mockResolvedValue({
        user: newUserMock as firebaseAuth.User,
        providerId: null,
        operationType: "signIn",
      });

      const apiStore = useAPIStore();
      const apiSpy = vi.spyOn(apiStore, "request").mockResolvedValue({ success: true });

      const auth = useAuth();
      const createdUser = await auth.register("new@example.com", "password123");

      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "new@example.com",
        "password123",
      );
      expect(apiSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          schema: expect.objectContaining({
            $id: "/auth/send-verification",
          }),
          params: { email: "new@example.com" },
        }),
      );
      expect(firebaseAuth.signOut).toHaveBeenCalled();
      expect(createdUser).toBe(newUserMock);
    });
  });

  describe("login", () => {
    test("logs in user with verified email", async () => {
      vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser as unknown as firebaseAuth.User,
        providerId: null,
        operationType: "signIn",
      });

      const auth = useAuth();
      const loggedInUser = await auth.login("test@example.com", "password123");

      expect(mockUser.reload).toHaveBeenCalled();
      expect(loggedInUser).toBe(mockUser);
    });

    test("throws error and signs out if email is not verified", async () => {
      const unverifiedUser = {
        email: "unverified@example.com",
        emailVerified: false,
        reload: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue({
        user: unverifiedUser as unknown as firebaseAuth.User,
        providerId: null,
        operationType: "signIn",
      });

      const auth = useAuth();
      await expect(auth.login("unverified@example.com", "password123")).rejects.toThrow(
        "Please verify your email address before logging in.",
      );
      expect(firebaseAuth.signOut).toHaveBeenCalled();
    });

    test("saves credentials in Desktop mode", async () => {
      const infraStore = useInfraStore();
      infraStore.app_mode = appMode.DESKTOP;

      const saveCredentialsSpy = vi.fn();
      (
        globalThis as unknown as { electronAPI: { save_credentials: typeof saveCredentialsSpy } }
      ).electronAPI = {
        save_credentials: saveCredentialsSpy,
      };

      vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser as unknown as firebaseAuth.User,
        providerId: null,
        operationType: "signIn",
      });

      const auth = useAuth();
      await auth.login("test@example.com", "password123");

      expect(saveCredentialsSpy).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  describe("deleteAccount", () => {
    test("reauthenticates and deletes logged-in user", async () => {
      const auth = useAuth();
      await auth.deleteAccount("currentPassword");

      expect(firebaseAuth.EmailAuthProvider.credential).toHaveBeenCalledWith(
        "test@example.com",
        "currentPassword",
      );
      expect(firebaseAuth.reauthenticateWithCredential).toHaveBeenCalled();
      expect(firebaseAuth.deleteUser).toHaveBeenCalled();
      expect(firebaseAuth.signOut).toHaveBeenCalled();
    });

    test("throws error if no user logged in", async () => {
      mockUserRef.value = null;

      const auth = useAuth();
      await expect(auth.deleteAccount("password")).rejects.toThrow("No user logged in");
    });
  });

  describe("logout", () => {
    test("signs out Firebase user", async () => {
      const auth = useAuth();
      await auth.logout();
      expect(firebaseAuth.signOut).toHaveBeenCalled();
    });

    test("deletes electron credentials when in Desktop mode", async () => {
      const infraStore = useInfraStore();
      infraStore.app_mode = appMode.DESKTOP;

      const deleteCredentialsSpy = vi.fn().mockResolvedValue({ success: true });
      (
        globalThis as unknown as {
          electronAPI: { delete_credentials: typeof deleteCredentialsSpy };
        }
      ).electronAPI = {
        delete_credentials: deleteCredentialsSpy,
      };

      const auth = useAuth();
      await auth.logout();

      expect(deleteCredentialsSpy).toHaveBeenCalled();
      expect(firebaseAuth.signOut).toHaveBeenCalled();
    });
  });
});
