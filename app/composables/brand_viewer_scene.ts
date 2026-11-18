import { type RGBA, VIEWER_SCENE_COLORS } from "@vease/utils/brand_themes";
import {
  SCENE_DEFAULT_BACKGROUND_COLOR,
  SCENE_DEFAULT_TEXT_COLOR,
} from "@ogw_front/utils/default_styles/constants";
import { Status } from "@ogw_front/utils/status";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";

function sameColor(first: RGBA, second: RGBA): boolean {
  return first.red === second.red && first.green === second.green && first.blue === second.blue;
}

// Gives the 3D scene the brand background and text colors. Only the OpenGeodeWeb defaults are replaced: a
// Color picked by the user, or saved in a project, is left alone.
function useBrandViewerScene(): void {
  const dataStyleStore = useDataStyleStore();
  const hybridViewerStore = useHybridViewerStore();

  watch(
    () => [
      hybridViewerStore.status,
      dataStyleStore.sceneStyle.background_color,
      dataStyleStore.sceneStyle.text.color,
    ],
    async () => {
      if (hybridViewerStore.status !== Status.CREATED) {
        return;
      }
      const { background_color, text } = dataStyleStore.sceneStyle;
      if (sameColor(background_color, SCENE_DEFAULT_BACKGROUND_COLOR)) {
        await dataStyleStore.setSceneBackgroundColor({ ...VIEWER_SCENE_COLORS.background });
      }
      if (sameColor(text.color, SCENE_DEFAULT_TEXT_COLOR)) {
        await dataStyleStore.setSceneTextColor({ ...VIEWER_SCENE_COLORS.text });
      }
    },
    { immediate: true },
  );
}

export { useBrandViewerScene };
