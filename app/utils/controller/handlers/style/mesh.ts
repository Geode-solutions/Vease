// Third party imports
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

type Setter<Value> = (store: StyleStore, id: string, value: Value) => Promise<unknown>;

interface MeshElementSetters {
  visibility: Setter<boolean>;
  color: Setter<RGBAColor>;
  constantColoring: (store: StyleStore, id: string) => Promise<unknown>;
}

/* oxlint-disable typescript/promise-function-async -- thin forwards to the store setters, which are already async */
const MESH_ELEMENT_SETTERS: Record<MeshElement, MeshElementSetters> = {
  points: {
    visibility: (store, id, value) => store.setMeshPointsVisibility(id, value),
    color: (store, id, value) => store.setMeshPointsColor(id, value),
    constantColoring: (store, id) => store.setMeshPointsActiveColoring(id, "constant"),
  },
  edges: {
    visibility: (store, id, value) => store.setMeshEdgesVisibility(id, value),
    color: (store, id, value) => store.setMeshEdgesColor(id, value),
    constantColoring: (store, id) => store.setMeshEdgesActiveColoring(id, "constant"),
  },
  cells: {
    visibility: (store, id, value) => store.setMeshCellsVisibility(id, value),
    color: (store, id, value) => store.setMeshCellsColor(id, value),
    constantColoring: (store, id) => store.setMeshCellsActiveColoring(id, "constant"),
  },
  polygons: {
    visibility: (store, id, value) => store.setMeshPolygonsVisibility(id, value),
    color: (store, id, value) => store.setMeshPolygonsColor(id, value),
    constantColoring: (store, id) => store.setMeshPolygonsActiveColoring(id, "constant"),
  },
  polyhedra: {
    visibility: (store, id, value) => store.setMeshPolyhedraVisibility(id, value),
    color: (store, id, value) => store.setMeshPolyhedraColor(id, value),
    constantColoring: (store, id) => store.setMeshPolyhedraActiveColoring(id, "constant"),
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
        await setters.visibility(store, item.id, visibility);
      },
    ),
    // A color shows only under the constant coloring, so it switches the element to it
    [`style/mesh/${element}/color`]: styleCommand(
      async (store, item, { color }: { color: string }) => {
        checkMesh(item, element);
        await setters.color(store, item.id, hexToRgba(color));
        await setters.constantColoring(store, item.id);
      },
    ),
  };
}

const MESH_STYLE_COMMANDS: Record<string, ControllerHandler> = {
  // The whole mesh visibility also shows or hides it in the data tree
  "style/mesh/visibility": styleCommand(
    async (_store, item, { visibility }: { visibility: boolean }) => {
      checkMesh(item);
      await setDataVisibility(item.id, visibility);
    },
  ),
  "style/mesh/color": styleCommand(async (store, item, { color }: { color: string }) => {
    checkMesh(item);
    await store.setMeshColor(item.id, hexToRgba(color));
  }),
  ...Object.fromEntries(
    MESH_ELEMENTS.flatMap((element) => Object.entries(elementCommands(element))),
  ),
  "style/mesh/points/size": styleCommand(async (store, item, { size }: { size: number }) => {
    checkMesh(item, "points");
    await store.setMeshPointsSize(item.id, size);
  }),
  "style/mesh/edges/width": styleCommand(async (store, item, { width }: { width: number }) => {
    checkMesh(item, "edges");
    await store.setMeshEdgesWidth(item.id, width);
  }),
  "style/mesh/cells/coloring": styleCommand(
    async (store, item, { coloring }: { coloring: "constant" | "textures" }) => {
      checkMesh(item, "cells");
      await store.setMeshCellsActiveColoring(item.id, coloring);
    },
  ),
  "style/mesh/polygons/coloring": styleCommand(
    async (store, item, { coloring }: { coloring: "constant" | "textures" }) => {
      checkMesh(item, "polygons");
      await store.setMeshPolygonsActiveColoring(item.id, coloring);
    },
  ),
};

export { MESH_STYLE_COMMANDS };
