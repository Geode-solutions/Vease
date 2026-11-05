import { type Auth, EmailAuthProvider } from "firebase/auth";
import { ref } from "vue";
import { setupActivePinia } from "@vease_tests/utils";
import { useFirebaseAuth } from "vuefire";
import { vi } from "vitest";

const mockUserRef = ref<unknown>(undefined);

// Avoids the `null` literal (lint) while still exercising useFirebaseAuth's `null` branch.
function parseNull(): null {
  const value: unknown = JSON.parse("null");
  if (value !== null) {
    throw new Error("Expected JSON.parse to return null");
  }
  return value;
}

// To call in beforeEach. Requires the test file to vi.mock firebase/auth and vuefire.
function resetAuthMocks(mockUser: unknown): void {
  setupActivePinia();
  vi.clearAllMocks();
  // oxlint-disable-next-line no-unsafe-type-assertion -- partial mock of the Auth type; only the fields this suite touches are needed, see tests/unit/server/utils/data_file.nuxt.test.ts for the established pattern
  vi.mocked(useFirebaseAuth).mockReturnValue({} as Auth);
  mockUserRef.value = mockUser;
  // Re-spied every test: the global afterEach hook (tests/setup_global_hooks.ts)
  // Calls vi.restoreAllMocks(), which un-spies EmailAuthProvider.credential
  // Set up in the vi.mock() factory (which only runs once, at module load).
  vi.spyOn(EmailAuthProvider, "credential");
}

export { mockUserRef, parseNull, resetAuthMocks };
