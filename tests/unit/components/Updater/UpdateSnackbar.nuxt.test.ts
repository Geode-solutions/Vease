import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import UpdateSnackbar from "@vease/components/Updater/UpdateSnackbar.vue";
import { flushPromises } from "@vue/test-utils";
import { useUpdaterStore } from "@vease/stores/updater";

vi.setConfig({ testTimeout: 10_000 });

const HALF = 50;
const BYTES_IN_MEGABYTE = 1_048_576;
const TOTAL_MEGABYTES = 100;
const TOTAL_BYTES = TOTAL_MEGABYTES * BYTES_IN_MEGABYTE;

function mountSnackbar(): ReturnType<typeof mountWithPlugins> {
  return mountWithPlugins(UpdateSnackbar, { attachTo: document.body });
}

describe("the UpdateSnackbar component", () => {
  beforeEach(() => {
    setupActivePinia();
    document.body.innerHTML = "";
  });

  test("is hidden when no update is in progress", async () => {
    mountSnackbar();
    await flushPromises();
    expect(document.querySelector("[data-testid='updateProgress']")).toBeNull();
    expect(document.querySelector("[data-testid='updateRestartButton']")).toBeNull();
  });

  test("shows download progress", async () => {
    const updaterStore = useUpdaterStore();
    mountSnackbar();
    updaterStore.status = {
      state: "downloading",
      version: "1.53.4",
      percent: HALF,
      transferred: TOTAL_BYTES / 2,
      total: TOTAL_BYTES,
      bytesPerSecond: 0,
    };
    await flushPromises();
    expect(document.querySelector("[data-testid='updateProgress']")).not.toBeNull();
    expect(document.body.textContent).toContain("Downloading Vease v1.53.4… 50%");
    expect(document.body.textContent).toContain("50.0 / 100.0 MB");
  });

  test("restart button calls restart once downloaded", async () => {
    const updaterStore = useUpdaterStore();
    const restartSpy = vi.spyOn(updaterStore, "restart").mockResolvedValue();
    mountSnackbar();
    updaterStore.status = { state: "downloaded", version: "1.53.4" };
    await flushPromises();
    const button = document.querySelector<HTMLElement>("[data-testid='updateRestartButton']");
    expect(button).not.toBeNull();
    button?.click();
    expect(restartSpy).toHaveBeenCalledWith();
  });

  test("hides errors from the background startup check", async () => {
    const updaterStore = useUpdaterStore();
    mountSnackbar();
    updaterStore.status = { state: "error", message: "fetch failed" };
    await flushPromises();
    expect(document.querySelector("[data-testid='updateCloseButton']")).toBeNull();
  });

  test("shows errors once the user asked for an update", async () => {
    const updaterStore = useUpdaterStore();
    mountSnackbar();
    updaterStore.notifyErrors = true;
    updaterStore.status = { state: "error", message: "fetch failed" };
    await flushPromises();
    expect(document.querySelector("[data-testid='updateCloseButton']")).not.toBeNull();
    expect(document.body.textContent).toContain("Update failed: fetch failed");
  });
});
