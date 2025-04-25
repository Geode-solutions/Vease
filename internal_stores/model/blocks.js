import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import _ from "lodash";
const blocks_schemas = viewer_schemas.opengeodeweb_viewer.model.blocks;

export function useBlocksStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();
  const dataBaseStore = useDataBaseStore();

  /** Getters **/
  function blockVisibility(id, block_id) {
    return dataStyleStore.styles[id].blocks[block_id].visibility;
  }

  /** Actions **/
  function setBlockVisibility(id, block_id, visibility) {
    const flat_index = dataBaseStore.getFlatIndex(id, block_id);
    viewer_call(
      {
        schema: blocks_schemas.visibility,
        params: { id, block_ids: [flat_index], visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].blocks[block_id].visibility = visibility;
          console.log(
            "setBlockVisibility",
            dataStyleStore.styles[id].blocks[block_id].visibility
          );
        },
      }
    );
  }

  function applyBlocksStyle(id) {
    const blocks = dataStyleStore.styles[id].blocks;
    for (const [block_id, style] of Object.entries(blocks)) {
      setBlockVisibility(id, block_id, style.visibility);
    }
  }

  return {
    blockVisibility,
    setBlockVisibility,
    applyBlocksStyle,
  };
}

export default useBlocksStyle;
