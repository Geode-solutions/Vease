// Third party imports
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { type ComponentMountingOptions, mount } from "@vue/test-utils";
import type { HTTPMethod } from "h3";
import { createApp } from "vue";
import { createTestingPinia } from "@pinia/testing";
import { createVuetify } from "vuetify";
import { setActivePinia } from "pinia";
import { vi } from "vitest";

if (globalThis.visualViewport === undefined) {
  (globalThis as unknown as { visualViewport: unknown }).visualViewport = {
    width: 1024,
    height: 768,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
    addEventListener: vi.fn<(type: string, listener: EventListener) => void>(),
    removeEventListener: vi.fn<(type: string, listener: EventListener) => void>(),
    dispatchEvent: vi.fn<(event: Event) => boolean>(),
  };
}

interface FakeResizeObserver {
  observe: () => void;
  unobserve: () => void;
  disconnect: () => void;
}

function createFakeResizeObserver(): FakeResizeObserver {
  return {
    observe: vi.fn<() => void>(),
    unobserve: vi.fn<() => void>(),
    disconnect: vi.fn<() => void>(),
  };
}

if (globalThis.ResizeObserver === undefined) {
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = createFakeResizeObserver;
}

const vuetify = createVuetify({ components, directives });

// Shared stub for GlassCard.vue's plain, no-extra-props usage. Components
// That pass GlassCard extra props (variant, padding, escapeFunction, ...)
// Need their own stub instead, since this one wouldn't render them.
const GLASS_CARD_STUB = {
  name: "GlassCard",
  template: "<div class='glass-card-stub'><slot /></div>",
};

// Wraps @vue/test-utils' mount() with the Vuetify plugin every component
// Test needs, so individual test files don't each repeat
// `global: { plugins: [vuetify] }`.
function mountWithPlugins<TComponent>(
  component: TComponent,
  options: ComponentMountingOptions<TComponent> = {},
): ReturnType<typeof mount<TComponent>> {
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      plugins: [vuetify, ...(options.global?.plugins ?? [])],
    },
  });
}

function setupActivePinia(): ReturnType<typeof createTestingPinia> {
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });
  setActivePinia(pinia);
  return pinia;
}

const HTTP_METHODS: readonly HTTPMethod[] = [
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT",
  "CONNECT",
  "DELETE",
  "OPTIONS",
  "TRACE",
];

function isHTTPMethod(method: string): method is HTTPMethod {
  return (HTTP_METHODS as readonly string[]).includes(method);
}

function toHTTPMethod(method: string | undefined): HTTPMethod {
  if (method === undefined || !isHTTPMethod(method)) {
    throw new Error(`Not a valid HTTP method: ${String(method)}`);
  }
  return method;
}

function assertDefined<TValue>(
  value: TValue | undefined,
  message = "Expected value to be defined",
): TValue {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

interface WithSetupResult<TValue> {
  result: TValue;
  unmount: () => void;
}

// Runs a composable inside a real component instance so lifecycle hooks
// (onUnmounted, onKeyStroke, ...) behave as they would in the app instead of
// Warning about a missing active instance.
function withSetup<TValue>(composable: () => TValue): WithSetupResult<TValue> {
  let result: TValue | undefined = undefined;
  const app = createApp({
    setup() {
      result = composable();
      return () => undefined;
    },
  });
  app.mount(document.createElement("div"));
  return {
    result: assertDefined(result, "Composable did not run during setup"),
    unmount: () => {
      app.unmount();
    },
  };
}

interface TrackedMount<TValue> {
  result: TValue;
  unmount: () => void;
}

interface ToolMounter {
  mountTool: <TValue>(composable: () => TValue) => TrackedMount<TValue>;
  unmountAll: () => void;
}

// Some composables register global listeners (e.g. a window-level Escape
// Handler via onKeyStroke), so leaving an instance mounted lets it observe
// (and potentially react to) later tests' events. Call unmountAll() in
// AfterEach to unmount every instance mounted through mountTool().
function createToolMounter(): ToolMounter {
  interface MountedTool {
    unmount: () => void;
  }
  let mountedTools: MountedTool[] = [];

  function mountTool<TValue>(composable: () => TValue): TrackedMount<TValue> {
    const handle = withSetup(composable);
    let unmounted = false;
    const tracked: MountedTool = {
      unmount: () => {
        if (unmounted) {
          return;
        }
        unmounted = true;
        handle.unmount();
      },
    };
    mountedTools.push(tracked);
    return { result: handle.result, unmount: tracked.unmount };
  }

  function unmountAll(): void {
    for (const tool of mountedTools) {
      tool.unmount();
    }
    mountedTools = [];
  }

  return { mountTool, unmountAll };
}

export {
  setupActivePinia,
  vuetify,
  mountWithPlugins,
  toHTTPMethod,
  assertDefined,
  withSetup,
  createToolMounter,
  GLASS_CARD_STUB,
};
