import { VIEWER_SCENE_COLORS } from "@vease/utils/brand_themes";

// oxlint-disable-next-line import/no-default-export
export default defineAppConfig({
  ogwFront: {
    // Vease chrome follows the user's light/dark choice (see composables/color_theme.ts)
    chromeTheme: "inherit",
    orientationOverlay: true,
    // The map or satellite view under the georeferenced data is a Vease feature
    basemap: true,
    // A new or reset scene takes the brand colors; a saved scene, or a color picked by the user, keeps its own
    sceneColors: VIEWER_SCENE_COLORS,
  },
});
