import useState from "~/internal_stores/state.js";
import useMeshStyle from "../internal_stores/mesh/index.js";

export const useDataStyleStore = defineStore("dataStyle", () => {
  return {
    ...useState(),
    ...useMeshStyle(),
  };
});

export default useDataStyleStore;
