export const emailRules = [
  (val: string): boolean | string => Boolean(val) || "Email is required",
  (val: string): boolean | string =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u.test(val) || "E-mail must be valid",
];
