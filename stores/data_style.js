import useDataStyleState from "../internal_stores/data_style_state.js";
import useMeshStyle from "../internal_stores/mesh/index.js";

export const useDataStyleStore = defineStore("dataStyle", () => {
  return {
    ...useDataStyleState(),
    ...useMeshStyle(),
  };
});

export default useDataStyleStore;
