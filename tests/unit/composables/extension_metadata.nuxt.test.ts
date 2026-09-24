import { beforeEach, describe, expect, test } from "vitest";
import { setupActivePinia } from "@vease_tests/utils";
import { useExtensionMetadata } from "@vease/composables/extension_metadata";
import { useUIStore } from "@vease/stores/ui";

// Avoids the `null` literal (lint) while still testing null handling.
const NULL_VALUE: null = JSON.parse("null");

describe("useExtensionMetadata composable", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  describe("getExtensionName", () => {
    test("returns the metadata name when present", () => {
      const { getExtensionName } = useExtensionMetadata();
      expect(getExtensionName({ id: "ext-1", metadata: { name: "My Extension" } })).toBe(
        "My Extension",
      );
    });

    test("falls back to the id when metadata name is missing", () => {
      const { getExtensionName } = useExtensionMetadata();
      expect(getExtensionName({ id: "ext-1", metadata: {} })).toBe("ext-1");
    });

    test("falls back to the id when metadata name is empty", () => {
      const { getExtensionName } = useExtensionMetadata();
      expect(getExtensionName({ id: "ext-1", metadata: { name: "" } })).toBe("ext-1");
    });

    test("returns a generic label when neither name nor id are available", () => {
      const { getExtensionName } = useExtensionMetadata();
      expect(getExtensionName({ metadata: {} })).toBe("Unknown Extension");
      expect(getExtensionName(NULL_VALUE)).toBe("Unknown Extension");
      expect(getExtensionName(undefined)).toBe("Unknown Extension");
    });
  });

  describe("getExtensionDescription", () => {
    test("returns the metadata description when present", () => {
      const { getExtensionDescription } = useExtensionMetadata();
      expect(
        getExtensionDescription({ id: "ext-1", metadata: { description: "Does things" } }),
      ).toBe("Does things");
    });

    test("falls back to a generic description when missing or empty", () => {
      const { getExtensionDescription } = useExtensionMetadata();
      expect(getExtensionDescription({ id: "ext-1", metadata: { description: "" } })).toBe(
        "Custom extension module",
      );
      expect(getExtensionDescription(NULL_VALUE)).toBe("Custom extension module");
    });
  });

  describe("getExtensionVersion", () => {
    test("returns the metadata version when present", () => {
      const { getExtensionVersion } = useExtensionMetadata();
      expect(getExtensionVersion({ id: "ext-1", metadata: { version: "1.2.3" } })).toBe("1.2.3");
    });

    test("returns undefined when version is missing, empty, or extension is nullish", () => {
      const { getExtensionVersion } = useExtensionMetadata();
      expect(getExtensionVersion({ id: "ext-1", metadata: {} })).toBeUndefined();
      expect(getExtensionVersion({ id: "ext-1", metadata: { version: "" } })).toBeUndefined();
      expect(getExtensionVersion(NULL_VALUE)).toBeUndefined();
      expect(getExtensionVersion(undefined)).toBeUndefined();
    });
  });

  describe("getExtensionTools / getExtensionToolsCount", () => {
    test("returns only tools registered under the extension's path", () => {
      const uiStore = useUIStore();
      uiStore.registerToolComponent({ id: "tool-a", component: {} }, "ext-1");
      uiStore.registerToolComponent({ id: "tool-b", component: {} }, "ext-2");
      uiStore.registerToolComponent({ id: "tool-c", component: {} }, "ext-1");

      const { getExtensionTools, getExtensionToolsCount } = useExtensionMetadata();
      const tools = getExtensionTools({ id: "ext-1" });

      expect(tools.map((tool) => tool.id)).toStrictEqual(["tool-a", "tool-c"]);
      expect(getExtensionToolsCount({ id: "ext-1" })).toBe(2);
    });

    test("returns an empty list for a nullish extension", () => {
      const { getExtensionTools, getExtensionToolsCount } = useExtensionMetadata();
      expect(getExtensionTools(NULL_VALUE)).toStrictEqual([]);
      expect(getExtensionToolsCount(undefined)).toBe(0);
    });

    test("returns an empty list when no tool matches the extension", () => {
      const uiStore = useUIStore();
      uiStore.registerToolComponent({ id: "tool-a", component: {} }, "ext-1");

      const { getExtensionTools } = useExtensionMetadata();
      expect(getExtensionTools({ id: "ext-unknown" })).toStrictEqual([]);
    });
  });
});
