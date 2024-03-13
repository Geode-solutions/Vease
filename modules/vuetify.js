import colors from "vuetify/lib/util/colors"
import { defineNuxtModule } from "@nuxt/kit"

const vuetify_defaults = {
  defaultAssets: true,
  icons: {
    defaultSet: "mdi",
  },
  ssr: true,
  defaults: {
    VBtn: {
      style: "text-transform: none;",
    },
    VCard: {
      elevation: 5,
      style: "border-radius: 15px;",
    },
    VExpansionPanel: {
      elevation: 5,
      style: "border-radius: 15px;",
    },
  },
}

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
}
// console.log("vuetify", vuetify)
export default defineNuxtModule({
  setup(_options, nuxt) {
    nuxt.hook("vuetify:registerModule", (register) =>
      register({
        moduleOptions: {},
        vuetifyOptions: {
          ...vuetify_defaults,
          theme: {
            defaultTheme: "light_theme",
            themes: {
              light_theme,
            },
          },
        },
      }),
    )
  },
})
