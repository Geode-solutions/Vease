import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const surfaces_schemas = viewer_schemas.opengeodeweb_viewer.model.surfaces;

export function useSurfacesStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function surfacesVisibility(id) {
    return dataStyleStore.styles[id].surfaces.visibility;
  }

  /** Actions **/
  function setSurfacesVisibility(id, visibility) {
    viewer_call(
      {
        schema: surfaces_schemas.visibility,
        params: { id, visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].surfaces.visibility = visibility;
          console.log(
            "setSurfacesVisibility",
            dataStyleStore.styles[id].surfaces.visibility
          );
        },
      }
    );
  }

  function applySurfacesStyle(id, style) {
    setSurfacesVisibility(id, style.visibility);
  }

  return {
    surfacesVisibility,
    setSurfacesVisibility,
    applySurfacesStyle,
  };
}

export default useSurfacesStyle;
