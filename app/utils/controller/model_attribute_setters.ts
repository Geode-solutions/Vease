// Local imports
import type { AttributeInput, StyleStore } from "@vease/utils/controller/attribute_setter_types";
import type { AttributeKind, ModelComponentTarget } from "@vease/utils/controller/targets";

interface ModelAttributeSetters {
  colorMap: (store: StyleStore, id: string, componentId?: string) => string | undefined;
  storedTimeStep: (store: StyleStore, id: string, componentId?: string) => number | undefined;
  attribute: (
    store: StyleStore,
    id: string,
    componentIds: string[],
    input: AttributeInput,
  ) => Promise<unknown>;
  timeStep: (
    store: StyleStore,
    id: string,
    componentIds: string[],
    timeStep: number,
  ) => Promise<unknown>;
}

interface ModelComponentSetters {
  kinds: Partial<Record<AttributeKind, ModelAttributeSetters>>;
  activate: (
    store: StyleStore,
    id: string,
    componentIds: string[],
    kind: AttributeKind,
  ) => Promise<unknown>;
}

/* oxlint-disable typescript/promise-function-async -- thin forwards to the store setters, which are already async */
const MODEL_SETTERS: Record<ModelComponentTarget, ModelComponentSetters> = {
  corners: {
    kinds: {
      vertex: {
        colorMap: (store, id, componentId) =>
          store.modelCornersVertexAttributeColorMap(id, componentId),
        storedTimeStep: (store, id, componentId) =>
          store.modelCornersVertexAttributeTimeStep(id, componentId),
        attribute: (store, id, ids, input) => store.setModelCornersVertexAttribute(id, ids, input),
        timeStep: (store, id, ids, step) =>
          store.setModelCornersVertexAttributeTimeStep(id, ids, step),
      },
    },
    activate: (store, id, ids, kind) => store.setModelCornersActiveColoring(id, ids, kind),
  },
  lines: {
    kinds: {
      edge: {
        colorMap: (store, id, componentId) =>
          store.modelLinesEdgeAttributeColorMap(id, componentId),
        storedTimeStep: (store, id, componentId) =>
          store.modelLinesEdgeAttributeTimeStep(id, componentId),
        attribute: (store, id, ids, input) => store.setModelLinesEdgeAttribute(id, ids, input),
        timeStep: (store, id, ids, step) => store.setModelLinesEdgeAttributeTimeStep(id, ids, step),
      },
      vertex: {
        colorMap: (store, id, componentId) =>
          store.modelLinesVertexAttributeColorMap(id, componentId),
        storedTimeStep: (store, id, componentId) =>
          store.modelLinesVertexAttributeTimeStep(id, componentId),
        attribute: (store, id, ids, input) => store.setModelLinesVertexAttribute(id, ids, input),
        timeStep: (store, id, ids, step) =>
          store.setModelLinesVertexAttributeTimeStep(id, ids, step),
      },
    },
    activate: (store, id, ids, kind) => store.setModelLinesActiveColoring(id, ids, kind),
  },
  surfaces: {
    kinds: {
      polygon: {
        colorMap: (store, id, componentId) =>
          store.modelSurfacesPolygonAttributeColorMap(id, componentId),
        storedTimeStep: (store, id, componentId) =>
          store.modelSurfacesPolygonAttributeTimeStep(id, componentId),
        attribute: (store, id, ids, input) =>
          store.setModelSurfacesPolygonAttribute(id, ids, input),
        timeStep: (store, id, ids, step) =>
          store.setModelSurfacesPolygonAttributeTimeStep(id, ids, step),
      },
      vertex: {
        colorMap: (store, id, componentId) =>
          store.modelSurfacesVertexAttributeColorMap(id, componentId),
        storedTimeStep: (store, id, componentId) =>
          store.modelSurfacesVertexAttributeTimeStep(id, componentId),
        attribute: (store, id, ids, input) => store.setModelSurfacesVertexAttribute(id, ids, input),
        timeStep: (store, id, ids, step) =>
          store.setModelSurfacesVertexAttributeTimeStep(id, ids, step),
      },
    },
    activate: (store, id, ids, kind) => store.setModelSurfacesActiveColoring(id, ids, kind),
  },
  blocks: {
    kinds: {
      polyhedron: {
        colorMap: (store, id, componentId) =>
          store.modelBlocksPolyhedronAttributeColorMap(id, componentId),
        storedTimeStep: (store, id, componentId) =>
          store.modelBlocksPolyhedronAttributeTimeStep(id, componentId),
        attribute: (store, id, ids, input) =>
          store.setModelBlocksPolyhedronAttribute(id, ids, input),
        timeStep: (store, id, ids, step) =>
          store.setModelBlocksPolyhedronAttributeTimeStep(id, ids, step),
      },
      vertex: {
        colorMap: (store, id, componentId) =>
          store.modelBlocksVertexAttributeColorMap(id, componentId),
        storedTimeStep: (store, id, componentId) =>
          store.modelBlocksVertexAttributeTimeStep(id, componentId),
        attribute: (store, id, ids, input) => store.setModelBlocksVertexAttribute(id, ids, input),
        timeStep: (store, id, ids, step) =>
          store.setModelBlocksVertexAttributeTimeStep(id, ids, step),
      },
    },
    activate: (store, id, ids, kind) => store.setModelBlocksActiveColoring(id, ids, kind),
  },
};
/* oxlint-enable typescript/promise-function-async */

export { MODEL_SETTERS };
