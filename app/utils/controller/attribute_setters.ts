// Local imports
import type { AttributeInput, StyleStore } from "@vease/utils/controller/attribute_setter_types";
import {
  type AttributeKind,
  type MeshElement,
  isModelComponentTarget,
} from "@vease/utils/controller/targets";
import { ControllerError } from "@vease/utils/controller/errors";
import type { FoundAttribute } from "@vease/utils/controller/attributes";
import { MODEL_SETTERS } from "@vease/utils/controller/model_attribute_setters";

interface MeshAttributeSetters {
  colorMap: (store: StyleStore, id: string) => string | undefined;
  storedTimeStep: (store: StyleStore, id: string) => number | undefined;
  attribute: (store: StyleStore, id: string, input: AttributeInput) => Promise<unknown>;
  timeStep: (store: StyleStore, id: string, timeStep: number) => Promise<unknown>;
}

interface MeshElementSetters {
  kinds: Partial<Record<AttributeKind, MeshAttributeSetters>>;
  activate: (store: StyleStore, id: string, kind: AttributeKind) => Promise<unknown>;
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
        colorMap: (store, id) => store.meshPointsVertexAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshPointsVertexAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshPointsVertexAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshPointsVertexAttributeTimeStep(id, step),
      },
    },
    activate: (store, id, kind) => store.setMeshPointsActiveColoring(id, kind),
  },
  edges: {
    kinds: {
      edge: {
        colorMap: (store, id) => store.meshEdgesEdgeAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshEdgesEdgeAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshEdgesEdgeAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshEdgesEdgeAttributeTimeStep(id, step),
      },
      vertex: {
        colorMap: (store, id) => store.meshEdgesVertexAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshEdgesVertexAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshEdgesVertexAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshEdgesVertexAttributeTimeStep(id, step),
      },
    },
    activate: (store, id, kind) => store.setMeshEdgesActiveColoring(id, kind),
  },
  cells: {
    kinds: {
      cell: {
        colorMap: (store, id) => store.meshCellsCellAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshCellsCellAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshCellsCellAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshCellsCellAttributeTimeStep(id, step),
      },
      vertex: {
        colorMap: (store, id) => store.meshCellsVertexAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshCellsVertexAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshCellsVertexAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshCellsVertexAttributeTimeStep(id, step),
      },
    },
    activate: (store, id, kind) => store.setMeshCellsActiveColoring(id, kind),
  },
  polygons: {
    kinds: {
      polygon: {
        colorMap: (store, id) => store.meshPolygonsPolygonAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshPolygonsPolygonAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshPolygonsPolygonAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshPolygonsPolygonAttributeTimeStep(id, step),
      },
      vertex: {
        colorMap: (store, id) => store.meshPolygonsVertexAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshPolygonsVertexAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshPolygonsVertexAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshPolygonsVertexAttributeTimeStep(id, step),
      },
    },
    activate: (store, id, kind) => store.setMeshPolygonsActiveColoring(id, kind),
  },
  polyhedra: {
    kinds: {
      polyhedron: {
        colorMap: (store, id) => store.meshPolyhedraPolyhedronAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshPolyhedraPolyhedronAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshPolyhedraPolyhedronAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshPolyhedraPolyhedronAttributeTimeStep(id, step),
      },
      vertex: {
        colorMap: (store, id) => store.meshPolyhedraVertexAttributeColorMap(id),
        storedTimeStep: (store, id) => store.meshPolyhedraVertexAttributeTimeStep(id),
        attribute: (store, id, input) => store.setMeshPolyhedraVertexAttribute(id, input),
        timeStep: (store, id, step) => store.setMeshPolyhedraVertexAttributeTimeStep(id, step),
      },
    },
    activate: (store, id, kind) => store.setMeshPolyhedraActiveColoring(id, kind),
  },
};

function bindAttribute(
  store: StyleStore,
  id: string,
  { target, kind, componentIds = [] }: FoundAttribute,
): AttributeBinding {
  if (isModelComponentTarget(target)) {
    const { kinds, activate } = MODEL_SETTERS[target];
    const setters = kinds[kind];
    if (setters === undefined) {
      throw new ControllerError(`Model ${target} cannot be colored by ${kind} attributes`);
    }
    return {
      currentColorMap: () => setters.colorMap(store, id, componentIds[0]),
      storedTimeStep: () => setters.storedTimeStep(store, id, componentIds[0]),
      apply: (input) => setters.attribute(store, id, componentIds, input),
      applyTimeStep: (step) => setters.timeStep(store, id, componentIds, step),
      activate: () => activate(store, id, componentIds, kind),
    };
  }
  const { kinds, activate } = MESH_SETTERS[target];
  const setters = kinds[kind];
  if (setters === undefined) {
    throw new ControllerError(`Mesh ${target} cannot be colored by ${kind} attributes`);
  }
  return {
    currentColorMap: () => setters.colorMap(store, id),
    storedTimeStep: () => setters.storedTimeStep(store, id),
    apply: (input) => setters.attribute(store, id, input),
    applyTimeStep: (step) => setters.timeStep(store, id, step),
    activate: () => activate(store, id, kind),
  };
}
/* oxlint-enable typescript/promise-function-async */

export { bindAttribute };
export type { AttributeBinding };
