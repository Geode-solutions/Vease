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
  function setSurfaceVisibility(id, surface_id, visibility) {
    console.log("setSurfaceVisibility", id, surface_id, visibility);
    const flat_index = dataBaseStore.getFlatIndex(id, surface_id);
    viewer_call(
      {
        schema: surfaces_schemas.visibility,
        params: { id, block_ids: [flat_index], visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].surfaces[surface_id].visibility =
            visibility;
          console.log(
            "setSurfaceVisibility",
            dataStyleStore.styles[id].surfaces[surface_id].visibility
          );
        },
      }
    );
  }

  function applySurfacesStyle(id) {
    const surfaces = dataStyleStore.styles[id].surfaces;
    for (const [surface_id, style] of Object.entries(surfaces)) {
      setSurfaceVisibility(id, surface_id, style.visibility);
    }
  }

  return {
    surfaceVisibility,
    setSurfaceVisibility,
    applySurfacesStyle,
  };
}

export default useSurfacesStyle;
