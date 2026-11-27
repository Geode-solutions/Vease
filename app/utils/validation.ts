import type { Email } from "@vease/types/auth";
import type { Message } from "@ogw_front/types/ui";

export const emailRules = [
  (val: Email): boolean | Message => Boolean(val) || "Email is required",
  (val: Email): boolean | Message =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u.test(val) || "E-mail must be valid",
];
