import { describe, expect, test, vi } from "vitest";
import { asErrorLike } from "@vease_server/utils/errors";

vi.setConfig({ testTimeout: 10_000 });

const NOT_A_STRING_MESSAGE = 42;

describe("asErrorLike()", () => {
  test("extracts statusCode, statusMessage and message when present and well-typed", () => {
    const result = asErrorLike({ statusCode: 404, statusMessage: "Not Found", message: "oops" });

    expect(result).toStrictEqual({
      statusCode: 404,
      statusMessage: "Not Found",
      message: "oops",
    });
  });

  test("drops fields that have the wrong type instead of coercing them", () => {
    const result = asErrorLike({
      statusCode: "404",
      statusMessage: 500,
      message: NOT_A_STRING_MESSAGE,
    });

    expect(result).toStrictEqual({
      statusCode: undefined,
      statusMessage: undefined,
      message: undefined,
    });
  });

  test("returns an empty object for non-object errors", () => {
    expect(asErrorLike("plain string error")).toStrictEqual({});
    expect(asErrorLike(undefined)).toStrictEqual({});
    expect(asErrorLike(NOT_A_STRING_MESSAGE)).toStrictEqual({});
  });

  test("returns an empty object for null (typeof null is 'object' in JS, so this needs its own guard)", () => {
    const nullValue: unknown = JSON.parse("null");

    expect(asErrorLike(nullValue)).toStrictEqual({});
  });

  test("handles a partial error object", () => {
    const result = asErrorLike({ message: "only a message" });

    expect(result).toStrictEqual({
      statusCode: undefined,
      statusMessage: undefined,
      message: "only a message",
    });
  });
});
