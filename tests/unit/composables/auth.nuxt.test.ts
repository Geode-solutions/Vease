import {
  EmailAuthProvider,
  type UserCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  type signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockUserRef, parseNull, resetAuthMocks } from "@vease_tests/utils/auth_harness";
import { useAPIStore } from "@ogw_front/stores/api";
import { useAuth } from "@vease/composables/auth";
import { useFirebaseAuth } from "vuefire";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("firebase/auth"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createUserWithEmailAndPassword: vi.fn<typeof createUserWithEmailAndPassword>(),
    signInWithEmailAndPassword: vi.fn<typeof signInWithEmailAndPassword>(),
    signOut: vi.fn<typeof signOut>().mockResolvedValue(undefined),
    reauthenticateWithCredential: vi
      .fn<typeof reauthenticateWithCredential>()
      // oxlint-disable-next-line no-unsafe-type-assertion -- partial mock of the firebase UserCredential type; the resolved value is unused by this suite, see tests/unit/server/utils/data_file.nuxt.test.ts for the established pattern
      .mockResolvedValue(undefined as unknown as UserCredential),
    deleteUser: vi.fn<typeof deleteUser>().mockResolvedValue(undefined),
  };
});

vi.mock(import("vuefire"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useFirebaseAuth: vi.fn<typeof useFirebaseAuth>(),
    useCurrentUser: (): ReturnType<typeof actual.useCurrentUser> =>
      // oxlint-disable-next-line no-unsafe-type-assertion -- test doubles only implement the User fields this suite touches, see tests/unit/server/utils/data_file.nuxt.test.ts for the established pattern
      mockUserRef as unknown as ReturnType<typeof actual.useCurrentUser>,
  };
});

describe("the useAuth composable", () => {
  const mockUser = {
    email: "test@example.com",
    emailVerified: true,
    reload: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    resetAuthMocks(mockUser);
  });

  test("throws error if Firebase auth is not initialized", () => {
    vi.mocked(useFirebaseAuth).mockReturnValue(parseNull());
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
          // oxlint-disable-next-line no-unsafe-assignment -- expect.objectContaining() is typed as any by vitest
          schema: expect.objectContaining({
            $id: "cloud_api/auth/send-password-reset",
          }),
          params: { email: "test@example.com" },
        }),
        { skip_feedback_error: true },
      );
      expect(result).toStrictEqual({ success: true });
    });

    test("rethrows the API request error", async () => {
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockRejectedValue(new Error("User not found"));

      const auth = useAuth();
      await expect(auth.resetPassword("nonexistent@example.com")).rejects.toThrow("User not found");
    });

    test("throws a generic error if the API request rejects with a non-Error value", async () => {
      const apiStore = useAPIStore();
      vi.spyOn(apiStore, "request").mockRejectedValue("network down");

      const auth = useAuth();
      await expect(auth.resetPassword("nonexistent@example.com")).rejects.toThrow(
        "Failed to send password reset email.",
      );
    });
  });

  describe("the register action", () => {
    test("creates user, sends verification email, and signs out", async () => {
      const newUserMock = { email: "new@example.com" };
      // oxlint-disable-next-line no-unsafe-type-assertion -- partial mock of the firebase UserCredential type; only the fields this suite touches are needed, see tests/unit/server/utils/data_file.nuxt.test.ts for the established pattern
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: newUserMock,
        providerId: undefined,
        operationType: "signIn",
      } as unknown as UserCredential);

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
          // oxlint-disable-next-line no-unsafe-assignment -- expect.objectContaining() is typed as any by vitest
          schema: expect.objectContaining({
            $id: "cloud_api/auth/send-verification",
          }),
          params: { email: "new@example.com" },
        }),
      );
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(signOut).toHaveBeenCalledOnce();
      expect(createdUser).toBe(newUserMock);
    });
  });

  describe("the deleteAccount action", () => {
    test("reauthenticates and deletes logged-in user", async () => {
      const auth = useAuth();
      await auth.deleteAccount("currentPassword");

      // oxlint-disable-next-line typescript/unbound-method -- EmailAuthProvider.credential is a vi.fn() mock that doesn't use `this`
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
});
