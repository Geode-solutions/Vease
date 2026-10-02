import { beforeEach, describe, expect, test, vi } from "vitest";
import { mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import SideBar from "@vease/components/Layout/SideBar.vue";
import { VLayout } from "vuetify/components";
import { navigateTo } from "#app/composables/router";
import { useAuth } from "@vease/composables/auth";
import { useUIStore } from "@vease/stores/ui";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_INDEX = 0;
const SECOND_INDEX = 1;
const CHAT_BUTTON_INDEX = 3;

vi.mock(import("#app/composables/router"), async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, navigateTo: vi.fn<typeof navigateTo>() };
});

vi.mock(import("@vease/composables/auth"), () => ({
  useAuth: vi.fn<typeof useAuth>(),
}));

function mockAuthComposable(isAuthenticated = false): void {
  vi.mocked(useAuth).mockReturnValue({
    isUserAuthenticated: computed(() => isAuthenticated),
    user: ref<unknown>(undefined),
    logout: vi.fn<() => void>(),
    autoLogin: vi.fn<() => void>(),
    register: vi.fn<() => void>(),
    login: vi.fn<() => void>(),
    deleteAccount: vi.fn<() => void>(),
    resetPassword: vi.fn<() => void>(),
    // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for casting a plain mock object to a composable's return type
  } as unknown as ReturnType<typeof useAuth>);
}

function mountSideBar(): ReturnType<typeof mountWithPlugins> {
  return mountWithPlugins(
    {
      components: { SideBar, VLayout },
      template: "<v-layout><SideBar /></v-layout>",
    },
    {
      global: {
        stubs: {
          VTooltip: {
            template: "<div><slot name='activator' :props='{}' /></div>",
          },
        },
      },
      attachTo: document.body,
    },
  );
}

describe("sidebar component", () => {
  beforeEach(() => {
    setupActivePinia();
    mockAuthComposable(false);
  });

  test("renders top navigation buttons", () => {
    const wrapper = mountSideBar();

    expect(wrapper.find("[data-testid='viewerNavButton']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='dataManagerNavButton']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='extensionsNavButton']").exists()).toBe(true);
  });

  test("navigates on top button clicks", async () => {
    const wrapper = mountSideBar();
    const sideBar = wrapper.findComponent(SideBar);

    const viewerBtn = sideBar.findComponent("[data-testid='viewerNavButton']");
    await viewerBtn.trigger("click");
    expect(navigateTo).toHaveBeenCalledWith("/");

    const dataManagerBtn = sideBar.findComponent("[data-testid='dataManagerNavButton']");
    await dataManagerBtn.trigger("click");
    expect(navigateTo).toHaveBeenCalledWith("/data_manager");

    const extensionsBtn = sideBar.findComponent("[data-testid='extensionsNavButton']");
    await extensionsBtn.trigger("click");
    expect(navigateTo).toHaveBeenCalledWith("/extensions");
  });

  test("toggles chat pip on chat button click", async () => {
    const wrapper = mountSideBar();
    const uiStore = useUIStore();
    const spySetShowChatPiP = vi.spyOn(uiStore, "setShowChatPiP");

    const buttons = wrapper.findAll("button");
    const chatBtn = buttons[CHAT_BUTTON_INDEX];
    expect(chatBtn).toBeDefined();
    await chatBtn?.trigger("click");
    expect(spySetShowChatPiP).toHaveBeenCalledWith(true);
  });

  test("displays account title when authenticated", () => {
    mockAuthComposable(true);
    const wrapper = mountSideBar();

    expect(wrapper.html()).toContain("mdi-account-outline");
  });

  test("displays login title when not authenticated", () => {
    mockAuthComposable(false);
    const wrapper = mountSideBar();

    expect(wrapper.html()).toContain("mdi-account-key-outline");
  });

  test("reorders top pages when drag and drop events occur", async () => {
    const wrapper = mountSideBar();

    const buttons = wrapper.findAll(".icon-style");
    const firstBtn = buttons[FIRST_INDEX];
    const secondBtn = buttons[SECOND_INDEX];

    expect(firstBtn).toBeDefined();
    expect(secondBtn).toBeDefined();

    const dragStartEvent = new Event("dragstart", { bubbles: true });
    Object.assign(dragStartEvent, {
      dataTransfer: { setData: vi.fn<(type: string, val: string) => void>() },
    });
    firstBtn?.element.dispatchEvent(dragStartEvent);

    const dropEvent = new Event("drop", { bubbles: true });
    secondBtn?.element.dispatchEvent(dropEvent);
    await wrapper.vm.$nextTick();
  });
});
