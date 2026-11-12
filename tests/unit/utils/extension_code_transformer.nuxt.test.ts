import { describe, expect, test, vi } from "vitest";
import { transformExtensionCode } from "@vease/utils/extension_code_transformer";

vi.setConfig({ testTimeout: 10_000 });

describe("the transformExtensionCode utility", () => {
  test("transforms vue imports to data URLs", () => {
    const inputCode = 'import { ref } from "vue";';
    const outputCode = transformExtensionCode(inputCode);

    expect(outputCode).toContain("data:text/javascript");
    expect(outputCode).toContain("Vue");
  });

  test("transforms store imports to global store references", () => {
    const inputCode = 'import { useAppStore } from "@ogw_front/app/stores/app.js";';
    const outputCode = transformExtensionCode(inputCode);

    expect(outputCode).toContain("globalThis.__VEASE_STORES__.useAppStore");
  });

  test("transforms global store function calls", () => {
    const inputCode = "const store = useInfraStore();";
    const outputCode = transformExtensionCode(inputCode);

    expect(outputCode).toBe("const store = globalThis.__VEASE_STORES__.useInfraStore();");
  });

  test("transforms dexie imports to the dexie of the app", async () => {
    globalThis.DexieModule = await import("dexie");
    const inputCode = 'import { liveQuery } from "dexie";';
    const outputCode = decodeURIComponent(transformExtensionCode(inputCode));

    expect(outputCode).toContain("export default DexieModule.default;");
    expect(outputCode).toContain("export const liveQuery = DexieModule.liveQuery;");
    expect(outputCode).not.toContain("export const default");
  });

  test("transforms database imports to the database of the app", () => {
    const inputCode =
      'import { Database, database } from "@geode/opengeodeweb-front/internal/database/database.js";';
    const outputCode = decodeURIComponent(transformExtensionCode(inputCode));

    expect(outputCode).toContain("export const Database = globalThis.__VEASE_UTILS__.Database;");
    expect(outputCode).toContain("export const database = globalThis.__VEASE_UTILS__.database;");
  });
});
