// Third party imports
import { useViewerStore } from "@ogw_front/stores/viewer";
import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_typed_schemas.js";

// Local imports
import { ControllerError } from "@vease/utils/controller/errors";
import { getHybridViewerStore } from "@vease/utils/external_stores";
import { hexToRgba } from "@vease/utils/controller/color";

interface SceneSettings {
  zScaling?: number;
  backgroundColor?: string;
  axes?: boolean;
  grid?: boolean;
}

async function applyScene(params: SceneSettings): Promise<Record<string, unknown>> {
  const settings = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
  if (Object.keys(settings).length === 0) {
    throw new ControllerError("scene needs zScaling, backgroundColor, axes or grid");
  }
  const viewerStore = useViewerStore();
  const viewerSchemas = viewer_schemas.opengeodeweb_viewer.viewer;
  if (params.zScaling !== undefined) {
    await getHybridViewerStore().setZScaling(params.zScaling);
  }
  if (params.backgroundColor !== undefined) {
    const { red, green, blue } = hexToRgba(params.backgroundColor);
    await viewerStore.request({
      schema: viewerSchemas.set_background_color,
      // oxlint-disable-next-line eslint/id-length -- r, g, b are the viewer parameter names
      params: { color: { r: red, g: green, b: blue } },
    });
  }
  if (params.axes !== undefined) {
    await viewerStore.request({
      schema: viewerSchemas.axes,
      params: { visibility: params.axes },
    });
  }
  if (params.grid !== undefined) {
    await viewerStore.request({
      schema: viewerSchemas.grid_scale,
      params: { visibility: params.grid },
    });
  }
  return settings;
}

export { applyScene };
