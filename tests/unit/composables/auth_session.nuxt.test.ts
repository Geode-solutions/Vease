import {
  type UserCredential,
  type createUserWithEmailAndPassword,
  type deleteUser,
  type reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mockUserRef, resetAuthMocks } from "@vease_tests/utils/auth_harness";
import { appMode } from "@ogw_shared/app_mode";
import { useAuth } from "@vease/composables/auth";
import type { useFirebaseAuth } from "vuefire";
import { useInfraStore } from "@ogw_front/stores/infra";

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

describe("the useAuth composable login and logout", () => {
  const mockUser = {
    email: "test@example.com",
    emailVerified: true,
    reload: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    resetAuthMocks(mockUser);
  });

  describe("the login action", () => {
    test("logs in user with verified email", async () => {
      // oxlint-disable-next-line no-unsafe-type-assertion -- partial mock of the firebase UserCredential type; only the fields this suite touches are needed, see tests/unit/server/utils/data_file.nuxt.test.ts for the established pattern
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser,
        providerId: undefined,
        operationType: "signIn",
      } as unknown as UserCredential);

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
      // oxlint-disable-next-line no-unsafe-type-assertion -- partial mock of the firebase UserCredential type; only the fields this suite touches are needed, see tests/unit/server/utils/data_file.nuxt.test.ts for the established pattern
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: unverifiedUser,
        providerId: undefined,
        operationType: "signIn",
      } as unknown as UserCredential);

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
      const electronAPI = { save_credentials: saveCredentialsSpy };
      // oxlint-disable-next-line no-unsafe-type-assertion -- no ambient type declares electronAPI on globalThis; this test-only augmentation mirrors app/composables/auth.ts's DesktopElectronAPI
      (globalThis as unknown as { electronAPI: typeof electronAPI }).electronAPI = electronAPI;

      // oxlint-disable-next-line no-unsafe-type-assertion -- partial mock of the firebase UserCredential type; only the fields this suite touches are needed, see tests/unit/server/utils/data_file.nuxt.test.ts for the established pattern
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser,
        providerId: undefined,
        operationType: "signIn",
      } as unknown as UserCredential);

      const auth = useAuth();
      await auth.login("test@example.com", "password123");

      expect(saveCredentialsSpy).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
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
      const electronAPI = { delete_credentials: deleteCredentialsSpy };
      // oxlint-disable-next-line no-unsafe-type-assertion -- no ambient type declares electronAPI on globalThis; this test-only augmentation mirrors app/composables/auth.ts's DesktopElectronAPI
      (globalThis as unknown as { electronAPI: typeof electronAPI }).electronAPI = electronAPI;

      const auth = useAuth();
      await auth.logout();

      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(deleteCredentialsSpy).toHaveBeenCalledOnce();
      // oxlint-disable-next-line vitest/prefer-called-times -- shared config also enables the contradictory prefer-called-once
      expect(signOut).toHaveBeenCalledOnce();
    });
  });
});
