import { afterEach, beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { setupActivePinia } from "@vease_tests/utils";
import { useUserStore } from "@vease/stores/user";

describe("the user store", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("state", () => {
    test("initial state", () => {
      const userStore = useUserStore();
      expect(userStore.firstName).toBe("");
      expect(userStore.lastName).toBe("");
      expect(userStore.email).toBe("");
      expect(userStore.password).toBe("");
      expect(userStore.image).toBe("");
      expectTypeOf(userStore.fetchUserData).toBeFunction();
      expectTypeOf(userStore.updateProfile).toBeFunction();
    });

    test("modifying user state", () => {
      const userStore = useUserStore();
      userStore.firstName = "John";
      userStore.lastName = "Doe";
      userStore.email = "john.doe@geode-solutions.com";

      expect(userStore.firstName).toBe("John");
      expect(userStore.lastName).toBe("Doe");
      expect(userStore.email).toBe("john.doe@geode-solutions.com");
    });
  });

  describe("actions", () => {
    test("fetchUserData executes without errors", async () => {
      const userStore = useUserStore();
      await expect(userStore.fetchUserData()).resolves.toBeUndefined();
    });

    test("updateProfile executes without errors", async () => {
      const userStore = useUserStore();
      await expect(userStore.updateProfile()).resolves.toBeUndefined();
    });
  });
});
