// Local imports
import type { AttributeInput, StyleStore } from "@vease/utils/controller/attribute_setter_types";
import type { AttributeKind, ModelComponentTarget } from "@vease/utils/controller/targets";
import type { DataId } from "@ogw_front/types/identifiers";

interface ModelAttributeSetters {
  colorMap: (store: StyleStore, modelId: DataId, componentId?: string) => string | undefined;
  storedTimeStep: (store: StyleStore, modelId: DataId, componentId?: string) => number | undefined;
  attribute: (
    store: StyleStore,
    modelId: DataId,
    componentIds: string[],
    input: AttributeInput,
  ) => Promise<unknown>;
  timeStep: (
    store: StyleStore,
    modelId: DataId,
    componentIds: string[],
    timeStep: number,
  ) => Promise<unknown>;
}

interface ModelComponentSetters {
  kinds: Partial<Record<AttributeKind, ModelAttributeSetters>>;
  activate: (
    store: StyleStore,
    modelId: DataId,
    componentIds: string[],
    kind: AttributeKind,
  ) => Promise<unknown>;
}

/* oxlint-disable typescript/promise-function-async -- thin forwards to the store setters, which are already async */
const MODEL_SETTERS: Record<ModelComponentTarget, ModelComponentSetters> = {
  corners: {
    kinds: {
      vertex: {
        colorMap: (store, modelId, componentId) =>
          store.modelCornersVertexAttributeColorMap(modelId, componentId),
        storedTimeStep: (store, modelId, componentId) =>
          store.modelCornersVertexAttributeTimeStep(modelId, componentId),
        attribute: (store, modelId, ids, input) =>
          store.setModelCornersVertexAttribute(modelId, ids, input),
        timeStep: (store, modelId, ids, step) =>
          store.setModelCornersVertexAttributeTimeStep(modelId, ids, step),
      },
    },
    activate: (store, modelId, ids, kind) =>
      store.setModelCornersActiveColoring(modelId, ids, kind),
  },
  lines: {
    kinds: {
      edge: {
        colorMap: (store, modelId, componentId) =>
          store.modelLinesEdgeAttributeColorMap(modelId, componentId),
        storedTimeStep: (store, modelId, componentId) =>
          store.modelLinesEdgeAttributeTimeStep(modelId, componentId),
        attribute: (store, modelId, ids, input) =>
          store.setModelLinesEdgeAttribute(modelId, ids, input),
        timeStep: (store, modelId, ids, step) =>
          store.setModelLinesEdgeAttributeTimeStep(modelId, ids, step),
      },
      vertex: {
        colorMap: (store, modelId, componentId) =>
          store.modelLinesVertexAttributeColorMap(modelId, componentId),
        storedTimeStep: (store, modelId, componentId) =>
          store.modelLinesVertexAttributeTimeStep(modelId, componentId),
        attribute: (store, modelId, ids, input) =>
          store.setModelLinesVertexAttribute(modelId, ids, input),
        timeStep: (store, modelId, ids, step) =>
          store.setModelLinesVertexAttributeTimeStep(modelId, ids, step),
      },
    },
    activate: (store, modelId, ids, kind) => store.setModelLinesActiveColoring(modelId, ids, kind),
  },
  surfaces: {
    kinds: {
      polygon: {
        colorMap: (store, modelId, componentId) =>
          store.modelSurfacesPolygonAttributeColorMap(modelId, componentId),
        storedTimeStep: (store, modelId, componentId) =>
          store.modelSurfacesPolygonAttributeTimeStep(modelId, componentId),
        attribute: (store, modelId, ids, input) =>
          store.setModelSurfacesPolygonAttribute(modelId, ids, input),
        timeStep: (store, modelId, ids, step) =>
          store.setModelSurfacesPolygonAttributeTimeStep(modelId, ids, step),
      },
      vertex: {
        colorMap: (store, modelId, componentId) =>
          store.modelSurfacesVertexAttributeColorMap(modelId, componentId),
        storedTimeStep: (store, modelId, componentId) =>
          store.modelSurfacesVertexAttributeTimeStep(modelId, componentId),
        attribute: (store, modelId, ids, input) =>
          store.setModelSurfacesVertexAttribute(modelId, ids, input),
        timeStep: (store, modelId, ids, step) =>
          store.setModelSurfacesVertexAttributeTimeStep(modelId, ids, step),
      },
    },
    activate: (store, modelId, ids, kind) =>
      store.setModelSurfacesActiveColoring(modelId, ids, kind),
  },
  blocks: {
    kinds: {
      polyhedron: {
        colorMap: (store, modelId, componentId) =>
          store.modelBlocksPolyhedronAttributeColorMap(modelId, componentId),
        storedTimeStep: (store, modelId, componentId) =>
          store.modelBlocksPolyhedronAttributeTimeStep(modelId, componentId),
        attribute: (store, modelId, ids, input) =>
          store.setModelBlocksPolyhedronAttribute(modelId, ids, input),
        timeStep: (store, modelId, ids, step) =>
          store.setModelBlocksPolyhedronAttributeTimeStep(modelId, ids, step),
      },
      vertex: {
        colorMap: (store, modelId, componentId) =>
          store.modelBlocksVertexAttributeColorMap(modelId, componentId),
        storedTimeStep: (store, modelId, componentId) =>
          store.modelBlocksVertexAttributeTimeStep(modelId, componentId),
        attribute: (store, modelId, ids, input) =>
          store.setModelBlocksVertexAttribute(modelId, ids, input),
        timeStep: (store, modelId, ids, step) =>
          store.setModelBlocksVertexAttributeTimeStep(modelId, ids, step),
      },
    },
    activate: (store, modelId, ids, kind) => store.setModelBlocksActiveColoring(modelId, ids, kind),
  },
};
/* oxlint-enable typescript/promise-function-async */

export { MODEL_SETTERS };
