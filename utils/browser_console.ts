// Third party imports
import { type LogType, consola } from "consola";

// Consola's browser reporter logs `%c<tag:type>%c <text>` followed by CSS style arguments.
// Chromium forwards the raw format string with the arguments appended (Electron
// `console-message` event, Playwright `ConsoleMessage.text()`).
// Strip the styling and re-log through the terminal consola to keep its formatting.
const CONSOLA_BADGE = /^%c(?<badge>[^%]*)%c (?<text>.*)$/su;
const CONSOLA_STYLE =
  /\s*background: [^;]+;\s*border-radius: 0\.5em;\s*color: white;\s*font-weight: bold;\s*padding: 2px 0\.5em;\s*/gu;
const BROWSER_LEVELS: Record<string, LogType> = {
  debug: "debug",
  error: "error",
  warning: "warn",
};

function isLogType(value: string): value is LogType {
  return value in consola.options.types;
}

function logBrowserConsole(level: string, message: string, prefix = ""): void {
  const fallbackType = BROWSER_LEVELS[level] ?? "info";
  const match = CONSOLA_BADGE.exec(message);
  if (!match?.groups) {
    consola[fallbackType](`${prefix}${message}`);
    return;
  }
  const text = (match.groups.text ?? "").replaceAll(CONSOLA_STYLE, " ").trim();
  // Badge is `tag:type`, `type` or `tag` (plain `log` type has no name)
  const parts = (match.groups.badge ?? "").split(":");
  const last = parts.at(-1) ?? "";
  const type = isLogType(last) ? last : fallbackType;
  const tag = (isLogType(last) ? parts.slice(0, -1) : parts).join(":");
  (tag ? consola.withTag(tag) : consola)[type](`${prefix}${text}`);
}

export { logBrowserConsole };
