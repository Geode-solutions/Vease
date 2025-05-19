import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const surfaces_schemas = viewer_schemas.opengeodeweb_viewer.model.surfaces;

export function useSurfacesStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();
  const dataBaseStore = useDataBaseStore();

  /** Getters **/
  function surfaceVisibility(id, surface_id) {
    return dataStyleStore.styles[id].surfaces[surface_id].visibility;
  }

  /** Actions **/
  function setSurfaceVisibility(id, surface_ids, visibility) {
    const surface_flat_indexes = dataBaseStore.getFlatIndexes(id, surface_ids);
    viewer_call(
      {
        schema: surfaces_schemas.visibility,
        params: { id, block_ids: surface_flat_indexes, visibility },
      },
      {
        response_function: () => {
          for (const surface_id of surface_ids)
            dataStyleStore.styles[id].surfaces[surface_id].visibility =
              visibility;
          console.log("setSurfaceVisibility", surface_ids, visibility);
        },
      }
    );
  }

  function setSurfacesDefaultStyle(id) {
    const surfaces = dataBaseStore.db[id]?.mesh_components?.["Surface"];
    if (!surfaces || surfaces.length === 0) return;

    if (!dataStyleStore.styles[id]) {
      dataStyleStore.styles[id] = {};
    }

    if (!dataStyleStore.styles[id].surfaces) {
      dataStyleStore.styles[id].surfaces = {};
    }

    const surface_ids = [];

    for (const surface_id of surfaces) {
      dataStyleStore.styles[id].surfaces[surface_id] =
        surfaceDefaultStyle(true);
      surface_ids.push(surface_id);
    }

    setSurfaceVisibility(id, surface_ids, true);
  }

  function applySurfacesStyle(id) {
    const surfaces = dataStyleStore.styles[id].surfaces;
    for (const [surface_id, style] of Object.entries(surfaces)) {
      setSurfaceVisibility(id, [surface_id], style.visibility);
    }
  }

  return {
    surfaceVisibility,
    setSurfacesDefaultStyle,
    setSurfaceVisibility,
    applySurfacesStyle,
  };
}

export default useSurfacesStyle;
