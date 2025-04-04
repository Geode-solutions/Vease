import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
const blocks_schemas = viewer_schemas.opengeodeweb_viewer.model.blocks;

export function useBlocksStyle() {
  /** State **/
  const dataStyleStore = useDataStyleStore();

  /** Getters **/
  function blocksVisibility(id) {
    return dataStyleStore.styles[id].blocks.visibility;
  }

  /** Actions **/
  function setBlocksVisibility(id, uuid, visibility) {
    const flat_index = getFlatIndex(uuid);
    viewer_call(
      {
        schema: blocks_schemas.visibility,
        params: { id, block_ids: [flat_index], visibility },
      },
      {
        response_function: () => {
          dataStyleStore.styles[id].blocks.visibility = visibility;
          console.log(
            "setBlocksVisibility",
            dataStyleStore.styles[id].blocks[uuid].visibility
          );
        },
      }
    );
  }

  function applyBlocksStyle(id, style) {
    setBlocksVisibility(id, style.visibility);
  }

  return {
    blocksVisibility,
    setBlocksVisibility,
    applyBlocksStyle,
  };
}

export default useBlocksStyle;
