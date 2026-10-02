import { describe, expect, test, vi } from "vitest";
import { emailRules } from "@vease/utils/validation";

vi.setConfig({ testTimeout: 10_000 });

describe("email validation rules", () => {
  const [requiredRule, validEmailRule] = emailRules;

  test("required rule validates presence of value", () => {
    expect(requiredRule?.("")).toBe("Email is required");
    expect(requiredRule?.("user@example.com")).toBe(true);
  });

  test("email format rule validates email format", () => {
    expect(validEmailRule?.("invalid-email")).toBe("E-mail must be valid");
    expect(validEmailRule?.("user@domain")).toBe("E-mail must be valid");
    expect(validEmailRule?.("user@domain.com")).toBe(true);
  });
});
