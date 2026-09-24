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
import { beforeEach, describe, expect, test, vi } from "vitest";
import { appMode } from "@ogw_shared/app_mode";
import { setupActivePinia } from "@vease_tests/utils";
import { useAPIStore } from "@vease/stores/api";
import { useAuth } from "@vease/composables/auth";
import { useFirebaseAuth } from "vuefire";
import { useInfraStore } from "@ogw_front/stores/infra";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("firebase/auth"), () => ({
  createUserWithEmailAndPassword: vi.fn<typeof createUserWithEmailAndPassword>(),
  signInWithEmailAndPassword: vi.fn<typeof signInWithEmailAndPassword>(),
  signOut: vi.fn<typeof signOut>().mockResolvedValue(undefined),
  reauthenticateWithCredential: vi
    .fn<typeof reauthenticateWithCredential>()
    .mockResolvedValue(undefined),
  deleteUser: vi.fn<typeof deleteUser>().mockResolvedValue(undefined),
  EmailAuthProvider: {
    credential: vi
      .fn<typeof EmailAuthProvider.credential>()
      .mockReturnValue({ providerId: "password" }),
  },
}));

const mockUserRef = ref<unknown>(undefined);

vi.mock(import("vuefire"), () => ({
  useFirebaseAuth: vi.fn<typeof useFirebaseAuth>(),
  useCurrentUser: () => mockUserRef,
}));

describe("the useAuth composable", () => {
  const mockUser = {
    email: "test@example.com",
    emailVerified: true,
    reload: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    setupActivePinia();
    vi.clearAllMocks();
    vi.mocked(useFirebaseAuth).mockReturnValue({} as Auth);
    mockUserRef.value = mockUser;
  });

  test("throws error if Firebase auth is not initialized", () => {
    vi.mocked(useFirebaseAuth).mockReturnValue(undefined as unknown as Auth);
    expect(() => useAuth()).toThrow("Firebase auth is not initialized");
  });

  describe("the resetPassword action", () => {
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
      expect(result).toStrictEqual({ success: true });
    });

    test("throws error if API request returns an error property", async () => {
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockResolvedValue({ error: "User not found" });

      const auth = useAuth();
      await expect(auth.resetPassword("nonexistent@example.com")).rejects.toThrow("User not found");
    });
  });

  describe("the register action", () => {
    test("creates user, sends verification email, and signs out", async () => {
      const newUserMock = { email: "new@example.com" };
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: newUserMock as User,
        providerId: undefined as unknown as string,
        operationType: "signIn",
      });

      const apiStore = useAPIStore();
      const apiSpy = vi.spyOn(apiStore, "request").mockResolvedValue({ success: true });

      const auth = useAuth();
      const createdUser = await auth.register("new@example.com", "password123");

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
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
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(signOut).toHaveBeenCalledOnce();
      expect(createdUser).toBe(newUserMock);
    });
  });

  describe("the login action", () => {
    test("logs in user with verified email", async () => {
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser as unknown as User,
        providerId: undefined as unknown as string,
        operationType: "signIn",
      });

      const auth = useAuth();
      const loggedInUser = await auth.login("test@example.com", "password123");

      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(mockUser.reload).toHaveBeenCalledOnce();
      expect(loggedInUser).toBe(mockUser);
    });

    test("throws error and signs out if email is not verified", async () => {
      const unverifiedUser = {
        email: "unverified@example.com",
        emailVerified: false,
        reload: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
      };
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: unverifiedUser as unknown as User,
        providerId: undefined as unknown as string,
        operationType: "signIn",
      });

      const auth = useAuth();
      await expect(auth.login("unverified@example.com", "password123")).rejects.toThrow(
        "Please verify your email address before logging in.",
      );
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(signOut).toHaveBeenCalledOnce();
    });

    test("saves credentials in Desktop mode", async () => {
      const infraStore = useInfraStore();
      infraStore.app_mode = appMode.DESKTOP;

      const saveCredentialsSpy = vi.fn<(args: { email: string; password: string }) => void>();
      (
        globalThis as unknown as { electronAPI: { save_credentials: typeof saveCredentialsSpy } }
      ).electronAPI = {
        save_credentials: saveCredentialsSpy,
      };

      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser as unknown as User,
        providerId: undefined as unknown as string,
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

  describe("the deleteAccount action", () => {
    test("reauthenticates and deletes logged-in user", async () => {
      const auth = useAuth();
      await auth.deleteAccount("currentPassword");

      expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
        "test@example.com",
        "currentPassword",
      );
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(reauthenticateWithCredential).toHaveBeenCalledOnce();
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(deleteUser).toHaveBeenCalledOnce();
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(signOut).toHaveBeenCalledOnce();
    });

    test("throws error if no user logged in", async () => {
      mockUserRef.value = undefined;

      const auth = useAuth();
      await expect(auth.deleteAccount("password")).rejects.toThrow("No user logged in");
    });
  });

  describe("the logout action", () => {
    test("signs out Firebase user", async () => {
      const auth = useAuth();
      await auth.logout();
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(signOut).toHaveBeenCalledOnce();
    });

    test("deletes electron credentials when in Desktop mode", async () => {
      const infraStore = useInfraStore();
      infraStore.app_mode = appMode.DESKTOP;

      const deleteCredentialsSpy = vi
        .fn<() => Promise<{ success: boolean }>>()
        .mockResolvedValue({ success: true });
      (
        globalThis as unknown as {
          electronAPI: { delete_credentials: typeof deleteCredentialsSpy };
        }
      ).electronAPI = {
        delete_credentials: deleteCredentialsSpy,
      };

      const auth = useAuth();
      await auth.logout();

      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(deleteCredentialsSpy).toHaveBeenCalledOnce();
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(signOut).toHaveBeenCalledOnce();
    });
  });
});
