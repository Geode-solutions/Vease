/* oxlint-disable sort-imports */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import ResizablePiP from "@vease/components/Layout/ResizablePiP.vue";
import { mount } from "@vue/test-utils";
import { setupActivePinia, vuetify } from "@vease_tests/utils";

const DEFAULT_TEST_WIDTH = 560;
const DEFAULT_TEST_HEIGHT = 480;
const DEFAULT_TEST_Z_INDEX = 1500;
const CUSTOM_TEST_WIDTH = 600;
const CUSTOM_TEST_HEIGHT = 500;
const CUSTOM_TEST_Z_INDEX = 2000;
const RIGHT_RESIZE_ZONE_INDEX = 3;

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: {
    name: "GlassCard",
    props: ["escapeFunction"],
    template: "<div class='glass-card-stub'><slot name='handle' /><slot /></div>",
  },
}));

describe("resizablepip component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  test("renders slot content inside teleported container", () => {
    mount(ResizablePiP, {
      slots: {
        default: "<div data-testid='pip-content'>Main Content</div>",
        handle: "<div data-testid='pip-handle'>Handle Content</div>",
      },
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Main Content");
    expect(document.body.innerHTML).toContain("Handle Content");
  });

  test("applies default width height and z-index styles", () => {
    mount(ResizablePiP, {
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    const pipElement = document.querySelector(".resizable-pip") as HTMLElement;
    expect(pipElement).toBeDefined();
    expect(pipElement.style.width).toBe(`${DEFAULT_TEST_WIDTH}px`);
    expect(pipElement.style.height).toBe(`${DEFAULT_TEST_HEIGHT}px`);
    expect(pipElement.style.zIndex).toBe(`${DEFAULT_TEST_Z_INDEX}`);
  });

  test("applies custom width height and z-index props", () => {
    mount(ResizablePiP, {
      props: {
        defaultWidth: CUSTOM_TEST_WIDTH,
        defaultHeight: CUSTOM_TEST_HEIGHT,
        zIndex: CUSTOM_TEST_Z_INDEX,
      },
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    const pipElement = document.querySelector(".resizable-pip") as HTMLElement;
    expect(pipElement.style.width).toBe(`${CUSTOM_TEST_WIDTH}px`);
    expect(pipElement.style.height).toBe(`${CUSTOM_TEST_HEIGHT}px`);
    expect(pipElement.style.zIndex).toBe(`${CUSTOM_TEST_Z_INDEX}`);
  });

  test("handles resize events on pointerdown pointermove and pointerup", () => {
    mount(ResizablePiP, {
      props: {
        defaultWidth: CUSTOM_TEST_WIDTH,
        defaultHeight: CUSTOM_TEST_HEIGHT,
      },
      global: { plugins: [vuetify] },
      attachTo: document.body,
    });

    const resizeZones = document.querySelectorAll(".resizable-pip > div.position-absolute");
    const rightResizeZone = resizeZones[RIGHT_RESIZE_ZONE_INDEX];
    expect(rightResizeZone).toBeDefined();

    const pointerDownEvent = new Event("pointerdown", { bubbles: true });
    Object.assign(pointerDownEvent, { clientX: 100, clientY: 100 });
    rightResizeZone?.dispatchEvent(pointerDownEvent);

    const pointerMoveEvent = new Event("pointermove", { bubbles: true });
    Object.assign(pointerMoveEvent, { clientX: 150, clientY: 100 });
    document.dispatchEvent(pointerMoveEvent);

    const pointerUpEvent = new Event("pointerup", { bubbles: true });
    document.dispatchEvent(pointerUpEvent);

    const pipElement = document.querySelector(".resizable-pip") as HTMLElement;
    expect(pipElement.style.width).not.toBe("");
  });
});
