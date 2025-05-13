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
  function setBlockVisibility(id, block_ids, visibility) {
    const block_flat_indexes = dataBaseStore.getFlatIndexes(id, block_ids);
    viewer_call(
      {
        schema: blocks_schemas.visibility,
        params: { id, block_ids: block_flat_indexes, visibility },
      },
      {
        response_function: () => {
          for (const block_id of block_ids)
            dataStyleStore.styles[id].blocks[block_id].visibility = visibility;
          console.log("setBlockVisibility", block_ids, visibility);
        },
      }
    );
  }

  function setBlocksDefaultStyle(id) {
    const blocks = dataBaseStore.db[id]?.mesh_components?.["Block"];
    if (!blocks || blocks.length === 0) return;

    if (!dataStyleStore.styles[id]) {
      dataStyleStore.styles[id] = {};
    }

    if (!dataStyleStore.styles[id].blocks) {
      dataStyleStore.styles[id].blocks = {};
    }

    const block_ids = [];

    for (const block_id of blocks) {
      dataStyleStore.styles[id].blocks[block_id] = blockDefaultStyle(true);
      block_ids.push(block_id);
    }

    setBlockVisibility(id, block_ids, true);
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
