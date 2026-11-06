// Local imports
import type { AttributeInput, StyleStore } from "@vease/utils/controller/attribute_setter_types";
import {
  type AttributeKind,
  type MeshElement,
  isModelComponentTarget,
} from "@vease/utils/controller/targets";
import { ControllerError } from "@vease/utils/controller/errors";
import type { DataId } from "@ogw_front/types/identifiers";
import type { FoundAttribute } from "@vease/utils/controller/attributes";
import { MODEL_SETTERS } from "@vease/utils/controller/model_attribute_setters";

interface MeshAttributeSetters {
  colorMap: (store: StyleStore, meshId: DataId) => string | undefined;
  storedTimeStep: (store: StyleStore, meshId: DataId) => number | undefined;
  attribute: (store: StyleStore, meshId: DataId, input: AttributeInput) => Promise<unknown>;
  timeStep: (store: StyleStore, meshId: DataId, timeStep: number) => Promise<unknown>;
}

interface MeshElementSetters {
  kinds: Partial<Record<AttributeKind, MeshAttributeSetters>>;
  activate: (store: StyleStore, meshId: DataId, kind: AttributeKind) => Promise<unknown>;
}

interface AttributeBinding {
  currentColorMap: () => string | undefined;
  storedTimeStep: () => number | undefined;
  apply: (input: AttributeInput) => Promise<unknown>;
  applyTimeStep: (timeStep: number) => Promise<unknown>;
  activate: () => Promise<unknown>;
}

/* oxlint-disable typescript/promise-function-async -- thin forwards to the store setters, which are already async */
const MESH_SETTERS: Record<MeshElement, MeshElementSetters> = {
  points: {
    kinds: {
      vertex: {
        colorMap: (store, meshId) => store.meshPointsVertexAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshPointsVertexAttributeTimeStep(meshId),
        attribute: (store, meshId, input) => store.setMeshPointsVertexAttribute(meshId, input),
        timeStep: (store, meshId, step) => store.setMeshPointsVertexAttributeTimeStep(meshId, step),
      },
    },
    activate: (store, meshId, kind) => store.setMeshPointsActiveColoring(meshId, kind),
  },
  edges: {
    kinds: {
      edge: {
        colorMap: (store, meshId) => store.meshEdgesEdgeAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshEdgesEdgeAttributeTimeStep(meshId),
        attribute: (store, meshId, input) => store.setMeshEdgesEdgeAttribute(meshId, input),
        timeStep: (store, meshId, step) => store.setMeshEdgesEdgeAttributeTimeStep(meshId, step),
      },
      vertex: {
        colorMap: (store, meshId) => store.meshEdgesVertexAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshEdgesVertexAttributeTimeStep(meshId),
        attribute: (store, meshId, input) => store.setMeshEdgesVertexAttribute(meshId, input),
        timeStep: (store, meshId, step) => store.setMeshEdgesVertexAttributeTimeStep(meshId, step),
      },
    },
    activate: (store, meshId, kind) => store.setMeshEdgesActiveColoring(meshId, kind),
  },
  cells: {
    kinds: {
      cell: {
        colorMap: (store, meshId) => store.meshCellsCellAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshCellsCellAttributeTimeStep(meshId),
        attribute: (store, meshId, input) => store.setMeshCellsCellAttribute(meshId, input),
        timeStep: (store, meshId, step) => store.setMeshCellsCellAttributeTimeStep(meshId, step),
      },
      vertex: {
        colorMap: (store, meshId) => store.meshCellsVertexAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshCellsVertexAttributeTimeStep(meshId),
        attribute: (store, meshId, input) => store.setMeshCellsVertexAttribute(meshId, input),
        timeStep: (store, meshId, step) => store.setMeshCellsVertexAttributeTimeStep(meshId, step),
      },
    },
    activate: (store, meshId, kind) => store.setMeshCellsActiveColoring(meshId, kind),
  },
  polygons: {
    kinds: {
      polygon: {
        colorMap: (store, meshId) => store.meshPolygonsPolygonAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshPolygonsPolygonAttributeTimeStep(meshId),
        attribute: (store, meshId, input) => store.setMeshPolygonsPolygonAttribute(meshId, input),
        timeStep: (store, meshId, step) =>
          store.setMeshPolygonsPolygonAttributeTimeStep(meshId, step),
      },
      vertex: {
        colorMap: (store, meshId) => store.meshPolygonsVertexAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshPolygonsVertexAttributeTimeStep(meshId),
        attribute: (store, meshId, input) => store.setMeshPolygonsVertexAttribute(meshId, input),
        timeStep: (store, meshId, step) =>
          store.setMeshPolygonsVertexAttributeTimeStep(meshId, step),
      },
    },
    activate: (store, meshId, kind) => store.setMeshPolygonsActiveColoring(meshId, kind),
  },
  polyhedra: {
    kinds: {
      polyhedron: {
        colorMap: (store, meshId) => store.meshPolyhedraPolyhedronAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshPolyhedraPolyhedronAttributeTimeStep(meshId),
        attribute: (store, meshId, input) =>
          store.setMeshPolyhedraPolyhedronAttribute(meshId, input),
        timeStep: (store, meshId, step) =>
          store.setMeshPolyhedraPolyhedronAttributeTimeStep(meshId, step),
      },
      vertex: {
        colorMap: (store, meshId) => store.meshPolyhedraVertexAttributeColorMap(meshId),
        storedTimeStep: (store, meshId) => store.meshPolyhedraVertexAttributeTimeStep(meshId),
        attribute: (store, meshId, input) => store.setMeshPolyhedraVertexAttribute(meshId, input),
        timeStep: (store, meshId, step) =>
          store.setMeshPolyhedraVertexAttributeTimeStep(meshId, step),
      },
    },
    activate: (store, meshId, kind) => store.setMeshPolyhedraActiveColoring(meshId, kind),
  },
};

function bindAttribute(
  store: StyleStore,
  dataId: DataId,
  { target, kind, componentIds = [] }: FoundAttribute,
): AttributeBinding {
  if (isModelComponentTarget(target)) {
    const { kinds, activate } = MODEL_SETTERS[target];
    const setters = kinds[kind];
    if (setters === undefined) {
      throw new ControllerError(`Model ${target} cannot be colored by ${kind} attributes`);
    }
    return {
      currentColorMap: () => setters.colorMap(store, dataId, componentIds[0]),
      storedTimeStep: () => setters.storedTimeStep(store, dataId, componentIds[0]),
      apply: (input) => setters.attribute(store, dataId, componentIds, input),
      applyTimeStep: (step) => setters.timeStep(store, dataId, componentIds, step),
      activate: () => activate(store, dataId, componentIds, kind),
    };
  }
  const { kinds, activate } = MESH_SETTERS[target];
  const setters = kinds[kind];
  if (setters === undefined) {
    throw new ControllerError(`Mesh ${target} cannot be colored by ${kind} attributes`);
  }
  return {
    currentColorMap: () => setters.colorMap(store, dataId),
    storedTimeStep: () => setters.storedTimeStep(store, dataId),
    apply: (input) => setters.attribute(store, dataId, input),
    applyTimeStep: (step) => setters.timeStep(store, dataId, step),
    activate: () => activate(store, dataId, kind),
  };
}
/* oxlint-enable typescript/promise-function-async */

export { bindAttribute };
export type { AttributeBinding };
