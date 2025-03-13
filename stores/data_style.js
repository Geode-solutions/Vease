import useState from "~/internal_stores/state.js";
import useMeshStyle from "../internal_stores/mesh/index.js";

export const useDataStyleStore = defineStore("dataStyle", () => {
  return {
    // objectVisibility,
    // selectedObjects,
    // addDataStyle,
    ...useState(),
    ...useMeshStyle(),
  };
});

export default useDataStyleStore;
