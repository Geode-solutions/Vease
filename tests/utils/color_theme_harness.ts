// Third party imports
import { createVuetify } from "vuetify";
import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";

// Local imports
import {
  DARK_THEME_NAME,
  LIGHT_THEME_NAME,
  darkTheme,
  lightTheme,
} from "@vease/utils/brand_themes";
import { useColorTheme } from "@vease/composables/color_theme";

// The color theme composable, called in a component mounted with the brand themes (light by default)
function mountColorTheme(): ReturnType<typeof useColorTheme> {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: LIGHT_THEME_NAME,
      themes: { [LIGHT_THEME_NAME]: lightTheme, [DARK_THEME_NAME]: darkTheme },
    },
  });
  const holder: { api?: ReturnType<typeof useColorTheme> } = {};
  mount(
    defineComponent({
      setup() {
        holder.api = useColorTheme();
        return {};
      },
      template: "<div />",
    }),
    { global: { plugins: [vuetify] } },
  );
  if (holder.api === undefined) {
    throw new Error("useColorTheme was not called");
  }
  return holder.api;
}

export { mountColorTheme };
