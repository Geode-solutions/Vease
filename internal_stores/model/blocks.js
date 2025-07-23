import viewer_schemas from "@geode/opengeodeweb-viewer/opengeodeweb_viewer_schemas.json";
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
  function setBlockVisibility(id, block_ids, visibility) {
    const block_flat_indexes = dataBaseStore.getFlatIndexes(id, block_ids);
    viewer_call(
      {
        schema: blocks_schemas.visibility,
        params: { id, block_ids: block_flat_indexes, visibility },
      },
      {
        response_function: () => {
          for (const block_id of block_ids) {
            if (!dataStyleStore.styles[id].blocks[block_id])
              dataStyleStore.styles[id].blocks[block_id] = {};
            dataStyleStore.styles[id].blocks[block_id].visibility = visibility;
          }
          console.log("setBlockVisibility", block_ids, visibility);
        },
      }
    );
  }

  function setBlocksDefaultStyle(id) {
    const block_ids = dataBaseStore.getBlocksUuids(id);
    setBlockVisibility(
      id,
      block_ids,
      dataStyleStore.styles[id].blocks.visibility
    );
  }

  function applyBlocksStyle(id) {
    const blocks = dataStyleStore.styles[id].blocks;
    for (const [block_id, style] of Object.entries(blocks)) {
      setBlockVisibility(id, [block_id], style.visibility);
    }
  }

  return {
    blockVisibility,
    setBlocksDefaultStyle,
    setBlockVisibility,
    applyBlocksStyle,
  };
}

export default useBlocksStyle;
