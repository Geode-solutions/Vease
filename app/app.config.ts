// oxlint-disable-next-line import/no-default-export
export default defineAppConfig({
  ogwFront: {
    // Vease chrome follows the user's light/dark choice (see composables/color_theme.ts)
    chromeTheme: "inherit",
    orientationOverlay: true,
  },
});
