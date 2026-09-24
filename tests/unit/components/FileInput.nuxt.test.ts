/* oxlint-disable sort-imports, vitest/require-test-timeout */
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { setupActivePinia, vuetify } from "@vease_tests/utils";
import { mount } from "@vue/test-utils";
import FileInput from "@vease/components/FileInput.vue";

const FILE_NAME = "sample_file.txt";
const FILE_LABEL = "Select target file";
const PREPEND_ICON = "mdi-paperclip";
const ACCEPT_PATTERN = ".txt,.csv";

describe("the FileInput component", () => {
  beforeEach(() => {
    setupActivePinia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders v-file-input with correct props and label", () => {
    const sampleFile = new File(["content"], FILE_NAME, { type: "text/plain" });
    const wrapper = mount(FileInput, {
      props: {
        value: sampleFile,
        label: FILE_LABEL,
        required: true,
        prependIcon: PREPEND_ICON,
        accept: ACCEPT_PATTERN,
      },
      global: { plugins: [vuetify] },
    });

    const fileInputComponent = wrapper.findComponent({ name: "VFileInput" });
    expect(fileInputComponent.exists()).toBe(true);
    expect(wrapper.text()).toContain(FILE_LABEL);
  });

  test("emits update:value event when a new file is selected", async () => {
    const sampleFile = new File(["initial"], FILE_NAME, { type: "text/plain" });
    const newFile = new File(["new data"], "new_file.txt", {
      type: "text/plain",
    });

    const wrapper = mount(FileInput, {
      props: {
        value: sampleFile,
        label: FILE_LABEL,
      },
      global: { plugins: [vuetify] },
    });

    const fileInputComponent = wrapper.findComponent({ name: "VFileInput" });
    await fileInputComponent.vm.$emit("update:modelValue", newFile);

    expect(wrapper.emitted("update:value")).toStrictEqual([[newFile]]);
  });
});
