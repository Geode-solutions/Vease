// Node imports
import { createRequire } from "node:module";
import fs from "node:fs";

// Third party imports
import * as components from "vuetify/components";
import { describe, expect, test, vi } from "vitest";
import { createVuetify } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi";
import { mount } from "@vue/test-utils";

// Local imports
import { MDI_TO_PHOSPHOR, MDI_TO_PHOSPHOR_FILL } from "@vease/utils/phosphor_icons";
import {
  PHOSPHOR_SET_NAME,
  phosphor,
  phosphorIconClass,
  phosphorIconOptions,
} from "@vease/utils/phosphor_icon_set";
import phosphorIconsPlugin from "@vease/plugins/phosphor_icons";

vi.setConfig({ testTimeout: 10_000 });

const require = createRequire(import.meta.url);
const phosphorCss = fs.readFileSync(require.resolve("@phosphor-icons/web/regular"), "utf8");
const phosphorFillCss = fs.readFileSync(require.resolve("@phosphor-icons/web/fill"), "utf8");

const vuetify = createVuetify({ components, icons: phosphorIconOptions() });

function renderIcon(template: string): string {
  const wrapper = mount({ template }, { global: { plugins: [vuetify] } });
  return wrapper.find("i").attributes("class") ?? "";
}

describe("the Phosphor icon set", () => {
  test("maps only to icons of the Phosphor regular font", () => {
    const missing = [...MDI_TO_PHOSPHOR.values()].filter(
      (name) => !phosphorCss.includes(`.ph.ph-${name}:before`),
    );
    expect(missing).toStrictEqual([]);
  });

  test("maps the filled icons only to icons of the Phosphor fill font", () => {
    const missing = [...MDI_TO_PHOSPHOR_FILL.values()].filter(
      (name) => !phosphorFillCss.includes(`.ph-fill.ph-${name}:before`),
    );
    expect(missing).toStrictEqual([]);
  });

  test("renders the filled MDI icons with the Phosphor fill weight", () => {
    expect(phosphorIconClass("mdi-eye")).toBe("ph-fill ph-eye mdi-eye");
    expect(phosphorIconClass("mdi-eye-off-outline")).toBe("ph ph-eye-slash mdi-eye-off-outline");
  });

  test("renders a mapped icon with Phosphor and keeps the mdi name as a marker", () => {
    expect(phosphorIconClass("mdi-database")).toBe("ph ph-database mdi-database");
  });

  test("keeps modifiers such as mdi-spin", () => {
    expect(phosphorIconClass(" mdi-loading mdi-spin ")).toBe(
      "ph ph-circle-notch mdi-loading mdi-spin",
    );
  });

  test("falls back to MDI for unmapped icons", () => {
    expect(phosphorIconClass("mdi-unknown-icon")).toBe("mdi mdi-unknown-icon");
  });

  test("accepts Phosphor names directly", () => {
    expect(phosphorIconClass("ph-acorn")).toBe("ph ph-acorn");
  });

  test("renders the icon prop with the v-icon classes", () => {
    const classes = renderIcon('<v-icon icon="mdi-database" size="small" />');
    expect(classes).toContain("ph ph-database mdi-database");
    expect(classes).toContain("v-icon--size-small");
  });

  test("renders an icon given as text content", () => {
    const classes = renderIcon("<v-icon> mdi-close </v-icon>");
    expect(classes).toContain("ph ph-x mdi-close");
  });

  test("renders the Vuetify aliases with Phosphor", () => {
    expect(renderIcon('<v-icon icon="$checkboxOn" />')).toContain("ph ph-check-square");
    expect(renderIcon('<v-icon icon="$dropdown" />')).toContain("ph ph-caret-down");
  });

  test("still reaches the mdi set explicitly", () => {
    const classes = renderIcon('<v-icon icon="mdi:mdi-database" />').split(" ");
    expect(classes).toContain("mdi");
    expect(classes).toContain("mdi-database");
    expect(classes).not.toContain("ph");
  });

  test("is made the default set by the Vease plugin", async () => {
    const nuxtApp = useNuxtApp();
    await phosphorIconsPlugin(nuxtApp);
    const vuetifyOptions = { icons: { defaultSet: "mdi", sets: { mdi } } };
    await nuxtApp.hooks.callHook("vuetify:before-create", { isDev: false, vuetifyOptions });

    expect(vuetifyOptions.icons.defaultSet).toBe(PHOSPHOR_SET_NAME);
    expect(vuetifyOptions.icons.sets).toStrictEqual({ mdi, [PHOSPHOR_SET_NAME]: phosphor });
  });
});
