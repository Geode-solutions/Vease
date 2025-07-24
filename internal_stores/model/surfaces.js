import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
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
          for (const surface_id of surface_ids) {
            if (!dataStyleStore.styles[id].surfaces[surface_id])
              dataStyleStore.styles[id].surfaces[surface_id] = {};
            dataStyleStore.styles[id].surfaces[surface_id].visibility =
              visibility;
          }
          console.log("setSurfaceVisibility", surface_ids, visibility);
        },
      }
    );
  }

  function setSurfacesDefaultStyle(id) {
    const surface_ids = dataBaseStore.getSurfacesUuids(id);
    setSurfaceVisibility(
      id,
      surface_ids,
      dataStyleStore.styles[id].surfaces.visibility
    );
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
