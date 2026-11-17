import {
  SCENE_DEFAULT_BACKGROUND_COLOR,
  SCENE_DEFAULT_TEXT_COLOR,
} from "@ogw_front/utils/default_styles/constants";
import { Status } from "@ogw_front/utils/status";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useTheme } from "vuetify";

import { type RGBA, VIEWER_SCENE_COLORS } from "@vease/utils/brand_themes";

function sameColor(first: RGBA, second: RGBA): boolean {
  return first.red === second.red && first.green === second.green && first.blue === second.blue;
}

// Colors that were set automatically (OpenGeodeWeb defaults or a theme's scene colors): they follow the
// Theme. Any other color was picked by the user and is left alone.
function isAutomatic(color: RGBA, defaultColor: RGBA, role: "background" | "text"): boolean {
  if (sameColor(color, defaultColor)) {
    return true;
  }
  return Object.values(VIEWER_SCENE_COLORS).some((sceneColors) =>
    sameColor(color, sceneColors[role]),
  );
}

// Keeps the 3D scene background and text (axes, scale labels) in tone with the light/dark theme.
function useThemedViewerScene(): void {
  const dataStyleStore = useDataStyleStore();
  const hybridViewerStore = useHybridViewerStore();
  const theme = useTheme();

  watch(
    () => [
      theme.global.name.value,
      hybridViewerStore.status,
      dataStyleStore.sceneStyle.background_color,
      dataStyleStore.sceneStyle.text.color,
    ],
    async () => {
      if (hybridViewerStore.status !== Status.CREATED) {
        return;
      }
      const target = VIEWER_SCENE_COLORS[theme.global.name.value];
      if (!target) {
        return;
      }
      const { background_color, text } = dataStyleStore.sceneStyle;
      if (
        isAutomatic(background_color, SCENE_DEFAULT_BACKGROUND_COLOR, "background") &&
        !sameColor(background_color, target.background)
      ) {
        await dataStyleStore.setSceneBackgroundColor({ ...target.background });
      }
      if (
        isAutomatic(text.color, SCENE_DEFAULT_TEXT_COLOR, "text") &&
        !sameColor(text.color, target.text)
      ) {
        await dataStyleStore.setSceneTextColor({ ...target.text });
      }
    },
    { immediate: true },
  );
}

export { useThemedViewerScene };
