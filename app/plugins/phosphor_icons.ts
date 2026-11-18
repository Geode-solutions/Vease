// Local imports
import { phosphorIconOptions } from "@vease/utils/phosphor_icon_set";

// Brand book: flat line icons from Phosphor (font CSS registered in nuxt.config `css`).
// Vuetify-nuxt-module only takes serializable icon options in nuxt.config, so the
// Component based set is registered here, once the module filled vuetifyOptions.icons
// (mdi set + aliases, @mdi/font CSS kept for the fallbacks).
export default defineNuxtPlugin({
  name: "vease:phosphor-icons",
  enforce: "pre",
  setup(nuxtApp) {
    nuxtApp.hook("vuetify:before-create", ({ vuetifyOptions }) => {
      vuetifyOptions.icons = phosphorIconOptions(vuetifyOptions.icons);
    });
  },
});
