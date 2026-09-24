import { GLASS_CARD_STUB, mountWithPlugins, setupActivePinia } from "@vease_tests/utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { DataItem } from "@vease/types/data_item";
import RenameDialog from "@vease/components/datamanager/RenameDialog.vue";

vi.setConfig({ testTimeout: 10_000 });

const FIRST_EVENT_INDEX = 0;
const EXPECTED_EVENT_COUNT = 1;

vi.mock(import("@ogw_front/components/GlassCard.vue"), () => ({
  default: GLASS_CARD_STUB,
}));

const mockItem: DataItem = {
  id: "item-1",
  name: "Original Name",
  geode_object_type: "BRep",
  visible: true,
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("rename dialog component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  test("renders dialog when show prop is true", () => {
    mountWithPlugins(RenameDialog, {
      props: {
        show: true,
        item: mockItem,
        initialName: "Original Name",
      },
      attachTo: document.body,
    });

    expect(document.body.innerHTML).toContain("Rename Item");
    expect(document.body.innerHTML).toContain("Enter a new name for this object.");
  });

  test("emits update:show false when cancel button is clicked", async () => {
    const wrapper = mountWithPlugins(RenameDialog, {
      props: {
        show: true,
        item: mockItem,
        initialName: "Original Name",
      },
      attachTo: document.body,
    });

    const cancelButton = document.body.querySelector(".v-card-actions .v-btn");
    cancelButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted("update:show");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual([false]);
  });

  test("emits confirm with current name on confirm button click", async () => {
    const wrapper = mountWithPlugins(RenameDialog, {
      props: {
        show: true,
        item: mockItem,
        initialName: "New Name",
      },
      attachTo: document.body,
    });

    const confirmButton = document.body.querySelector('[data-testid="renameDataConfirmButton"]');
    confirmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted("confirm");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual(["New Name"]);
  });

  test("does not emit confirm when current name is empty", async () => {
    const wrapper = mountWithPlugins(RenameDialog, {
      props: {
        show: true,
        item: mockItem,
        initialName: "",
      },
      attachTo: document.body,
    });

    const confirmButton = document.body.querySelector('[data-testid="renameDataConfirmButton"]');
    confirmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted("confirm");
    expect(emitted).toBeUndefined();
  });

  test("emits confirm when enter key is pressed in input field", async () => {
    const wrapper = mountWithPlugins(RenameDialog, {
      props: {
        show: true,
        item: mockItem,
        initialName: "Renamed Via Enter",
      },
      attachTo: document.body,
    });

    const input = document.body.querySelector('[data-testid="renameDataInput"] input');
    input?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted("confirm");
    expect(emitted).toBeDefined();
    expect(emitted?.length).toBe(EXPECTED_EVENT_COUNT);
    expect(emitted?.[FIRST_EVENT_INDEX]).toStrictEqual(["Renamed Via Enter"]);
  });

  test("updates current name when initialName prop changes", async () => {
    const wrapper = mountWithPlugins(RenameDialog, {
      props: {
        show: true,
        item: mockItem,
        initialName: "Initial",
      },
      attachTo: document.body,
    });

    await wrapper.setProps({ initialName: "Updated Name" });

    const confirmButton = document.body.querySelector('[data-testid="renameDataConfirmButton"]');
    confirmButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted("confirm");
    expect(emitted).toStrictEqual([["Updated Name"]]);
  });
});
