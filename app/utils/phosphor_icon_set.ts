// Third party imports
import type { IconOptions, IconProps, IconSet } from "vuetify";
import { type VNode, h } from "vue";
import { mdi } from "vuetify/iconsets/mdi";

// Local imports
import { MDI_TO_PHOSPHOR, MDI_TO_PHOSPHOR_FILL } from "@vease/utils/phosphor_icons";

const PHOSPHOR_SET_NAME = "phosphor";

// Classes rendering an icon name: "ph ph-<phosphor> <mdi name> <modifiers>" when mapped
// ("ph-fill ph-<phosphor> ..." for the filled ones),
// "mdi <name>" (exactly what Vuetify's mdi set renders) otherwise. The original mdi name
// Stays on the element as a marker so `.mdi-xxx` selectors (e2e tests) keep matching: its
// MDI ::before content loses against the more specific `.ph.ph-xxx:before` rule.
// Modifiers such as mdi-spin are kept, the MDI CSS animates the Phosphor glyph too.
function phosphorIconClass(icon: string): string {
  const trimmed = icon.trim();
  const [name = "", ...modifiers] = trimmed.split(/\s+/u);
  if (name.startsWith("ph-")) {
    return ["ph", name, ...modifiers].join(" ");
  }
  const filled = MDI_TO_PHOSPHOR_FILL.get(name);
  if (filled !== undefined) {
    return ["ph-fill", `ph-${filled}`, name, ...modifiers].join(" ");
  }
  const phosphor = MDI_TO_PHOSPHOR.get(name);
  if (phosphor === undefined) {
    return `mdi ${trimmed}`;
  }
  return ["ph", `ph-${phosphor}`, name, ...modifiers].join(" ");
}

// Same shape as Vuetify's VClassIcon: the v-icon classes, styles and attributes fall
// Through to the rendered tag, so sizes and colors behave exactly as with MDI.
function PhosphorIcon(props: IconProps): VNode {
  return h(props.tag, { class: phosphorIconClass(String(props.icon ?? "")) });
}
PhosphorIcon.props = ["icon", "tag"];

const phosphor: IconSet = { component: PhosphorIcon };

// Makes Phosphor the default set, keeping the mdi set (reachable as "mdi:mdi-xxx").
// Aliases ($close, $checkboxOn...) still point to mdi names, mapped by the Phosphor set.
function phosphorIconOptions(icons: IconOptions = {}): IconOptions {
  return {
    ...icons,
    defaultSet: PHOSPHOR_SET_NAME,
    sets: { mdi, ...icons.sets, [PHOSPHOR_SET_NAME]: phosphor },
  };
}

export { PHOSPHOR_SET_NAME, phosphor, phosphorIconClass, phosphorIconOptions };
