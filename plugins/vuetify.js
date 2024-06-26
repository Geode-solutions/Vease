import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";
import colors from "vuetify/lib/util/colors";
import "vuetify/styles";

import vuetify_default from "@geode/opengeodeweb-front/vuetify_config";

const light_theme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    primary: colors.teal.darken1,
    secondary: colors.teal.lighten4,
    accent: colors.amber.accent4,
    error: colors.red.lighten2,
    info: colors.yellow.accent4,
    success: colors.green.accent4,
    warning: colors.orange.accent4,
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ...vuetify_default,
    components: {
      ...components,
    },
    directives,
    theme: {
      defaultTheme: "light_theme",
      themes: {
        light_theme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
