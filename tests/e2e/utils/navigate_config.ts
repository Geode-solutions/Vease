import { isWindows } from "std-env";

const MILLISECONDS = 1000;
const LINUX_WAIT_BROWSER = 20;
const LINUX_WAIT_DESKTOP = 30;
const CLOUD_WAIT = 65;
const WINDOWS_WAIT_BROWSER = 30;
const WINDOWS_WAIT_DESKTOP = 60;

const WAIT_TIMES = {
  browser: (isWindows ? WINDOWS_WAIT_BROWSER : LINUX_WAIT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_WAIT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_WAIT_DESKTOP : LINUX_WAIT_DESKTOP) * MILLISECONDS,
};

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;
// Fixed so number/date formatting matches the shared baselines on every OS
const LOCALE = "en-US";
const TIMEZONE = "UTC";

export { LOCALE, MILLISECONDS, PAGE_HEIGHT, PAGE_WIDTH, TIMEZONE, WAIT_TIMES };
