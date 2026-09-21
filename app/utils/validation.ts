export const emailRules = [
  (val) => Boolean(val) || "Email is required",
  (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u.test(val) || "E-mail must be valid",
];
