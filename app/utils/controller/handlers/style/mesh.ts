// Third party imports
import type { DataId } from "@ogw_front/types/identifiers";
import type { RGBAColor } from "@ogw_front/utils/default_styles/constants";

// Local imports
import {
  type StyleStore,
  checkMesh,
  styleCommand,
} from "@vease/utils/controller/handlers/style/common";
import type { ControllerHandler } from "@vease/utils/controller/index";
import type { MeshElement } from "@vease/utils/controller/targets";
import { hexToRgba } from "@vease/utils/controller/color";
import { setDataVisibility } from "@vease/utils/data_actions";

type Setter<Value> = (store: StyleStore, meshId: DataId, value: Value) => Promise<unknown>;

interface MeshElementSetters {
  visibility: Setter<boolean>;
  color: Setter<RGBAColor>;
  constantColoring: (store: StyleStore, meshId: DataId) => Promise<unknown>;
}

/* oxlint-disable typescript/promise-function-async -- thin forwards to the store setters, which are already async */
const MESH_ELEMENT_SETTERS: Record<MeshElement, MeshElementSetters> = {
  points: {
    visibility: (store, meshId, value) => store.setMeshPointsVisibility(meshId, value),
    color: (store, meshId, value) => store.setMeshPointsColor(meshId, value),
    constantColoring: (store, meshId) => store.setMeshPointsActiveColoring(meshId, "constant"),
  },
  edges: {
    visibility: (store, meshId, value) => store.setMeshEdgesVisibility(meshId, value),
    color: (store, meshId, value) => store.setMeshEdgesColor(meshId, value),
    constantColoring: (store, meshId) => store.setMeshEdgesActiveColoring(meshId, "constant"),
  },
  cells: {
    visibility: (store, meshId, value) => store.setMeshCellsVisibility(meshId, value),
    color: (store, meshId, value) => store.setMeshCellsColor(meshId, value),
    constantColoring: (store, meshId) => store.setMeshCellsActiveColoring(meshId, "constant"),
  },
  polygons: {
    visibility: (store, meshId, value) => store.setMeshPolygonsVisibility(meshId, value),
    color: (store, meshId, value) => store.setMeshPolygonsColor(meshId, value),
    constantColoring: (store, meshId) => store.setMeshPolygonsActiveColoring(meshId, "constant"),
  },
  polyhedra: {
    visibility: (store, meshId, value) => store.setMeshPolyhedraVisibility(meshId, value),
    color: (store, meshId, value) => store.setMeshPolyhedraColor(meshId, value),
    constantColoring: (store, meshId) => store.setMeshPolyhedraActiveColoring(meshId, "constant"),
  },
};
/* oxlint-enable typescript/promise-function-async */

const MESH_ELEMENTS: MeshElement[] = ["points", "edges", "cells", "polygons", "polyhedra"];

function elementCommands(element: MeshElement): Record<string, ControllerHandler> {
  const setters = MESH_ELEMENT_SETTERS[element];
  return {
    [`style/mesh/${element}/visibility`]: styleCommand(
      async (store, item, { visibility }: { visibility: boolean }) => {
        checkMesh(item, element);
        await setters.visibility(store, item.data_id, visibility);
      },
    ),
    // A color shows only under the constant coloring, so it switches the element to it
    [`style/mesh/${element}/color`]: styleCommand(
      async (store, item, { color }: { color: string }) => {
        checkMesh(item, element);
        await setters.color(store, item.data_id, hexToRgba(color));
        await setters.constantColoring(store, item.data_id);
      },
    ),
  };
}

const MESH_STYLE_COMMANDS: Record<string, ControllerHandler> = {
  // The whole mesh visibility also shows or hides it in the data tree
  "style/mesh/visibility": styleCommand(
    async (_store, item, { visibility }: { visibility: boolean }) => {
      checkMesh(item);
      await setDataVisibility(item.data_id, visibility);
    },
  ),
  "style/mesh/color": styleCommand(async (store, item, { color }: { color: string }) => {
    checkMesh(item);
    await store.setMeshColor(item.data_id, hexToRgba(color));
  }),
  ...Object.fromEntries(
    MESH_ELEMENTS.flatMap((element) => Object.entries(elementCommands(element))),
  ),
  "style/mesh/points/size": styleCommand(async (store, item, { size }: { size: number }) => {
    checkMesh(item, "points");
    await store.setMeshPointsSize(item.data_id, size);
  }),
  "style/mesh/edges/width": styleCommand(async (store, item, { width }: { width: number }) => {
    checkMesh(item, "edges");
    await store.setMeshEdgesWidth(item.data_id, width);
  }),
  "style/mesh/cells/coloring": styleCommand(
    async (store, item, { coloring }: { coloring: "constant" | "textures" }) => {
      checkMesh(item, "cells");
      await store.setMeshCellsActiveColoring(item.data_id, coloring);
    },
  ),
  "style/mesh/polygons/coloring": styleCommand(
    async (store, item, { coloring }: { coloring: "constant" | "textures" }) => {
      checkMesh(item, "polygons");
      await store.setMeshPolygonsActiveColoring(item.data_id, coloring);
    },
  ),
};

export { MESH_STYLE_COMMANDS };
