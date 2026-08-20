import { isWindows } from "std-env";

const MILLISECONDS = 1000;
const LINUX_WAIT_BROWSER = 20;
const LINUX_WAIT_DESKTOP = 25;
const CLOUD_WAIT = 65;
const WINDOWS_WAIT_BROWSER = 25;
const WINDOWS_WAIT_DESKTOP = 30;

const WAIT_TIMES = {
  browser: (isWindows ? WINDOWS_WAIT_BROWSER : LINUX_WAIT_BROWSER) * MILLISECONDS,
  cloud: CLOUD_WAIT * MILLISECONDS,
  desktop: (isWindows ? WINDOWS_WAIT_DESKTOP : LINUX_WAIT_DESKTOP) * MILLISECONDS,
};

const beforeAllTimeout = 180_000;
const afterActionWait = 1500;
const modalTransitionWait = 2000;
const staggerMaxWait = 2000;
const defaultTimeout = 60_000;
const treeWaitTimeout = 60_000;
const randomMultiplier = 1000;

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 800;

export {
  PAGE_HEIGHT,
  PAGE_WIDTH,
  WAIT_TIMES,
  afterActionWait,
  beforeAllTimeout,
  defaultTimeout,
  modalTransitionWait,
  randomMultiplier,
  staggerMaxWait,
  treeWaitTimeout,
};
