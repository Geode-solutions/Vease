import { describe, expect, test } from "vitest";
import { transformExtensionCode } from "@vease/utils/extension_code_transformer";

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
});
