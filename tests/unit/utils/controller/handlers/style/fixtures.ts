import { type DataItem, useDataStore } from "@ogw_front/stores/data";
import { type Mock, vi } from "vitest";
import {
  getBackStore,
  getDataStyleStore,
  getHybridViewerStore,
} from "@vease/utils/external_stores";
import { controllerHandlers } from "@vease/utils/controller/index";

// The test files mock @ogw_front/stores/data and @vease/utils/external_stores; these helpers fill the mocks

type StoreMethod = Mock<(...args: unknown[]) => unknown>;
type StyleStoreMock = Record<string, StoreMethod>;

interface RequestArgs {
  schema: { $id: string };
  params?: Record<string, unknown>;
}

interface Stores {
  // The methods behind styleStore, made as the tests read them
  styleMethods: StyleStoreMock;
  styleStore: StyleStoreMock;
  dataStore: {
    item: Mock<(id: string) => Promise<DataItem>>;
    getMeshComponentGeodeIds: Mock<(id: string, type: string) => Promise<string[]>>;
  };
  hybridViewerStore: { remoteRender: Mock<() => Promise<void>> };
  request: Mock<(args: RequestArgs) => Promise<unknown>>;
}

const MESH: DataItem = {
  data_id: "mesh-1",
  geode_id: "geode-1",
  name: "surface",
  viewer_type: "mesh",
  geode_object_type: "PolygonalSurface3D",
  visible: true,
  created_at: "2026-10-08",
};

const MODEL: DataItem = {
  ...MESH,
  data_id: "model-1",
  geode_id: "geode-2",
  name: "brep",
  viewer_type: "model",
  geode_object_type: "BRep",
};

const OTHER_MESH: DataItem = { ...MESH, data_id: "mesh-2", geode_id: "geode-3", name: "other" };

const ORANGE_HEX = "#ff8800";
const ORANGE = { red: 255, green: 136, blue: 0, alpha: 1 };
const ONCE = 1;
const MISSING_ID = "missing";
const DEPTH_MAX = 10;
const TIME_STEP = 0.5;
const TIME_STEP_INDEX = 1;
const DEPTH = { attribute_name: "depth", nb_items: 1, min_value: 0, max_value: DEPTH_MAX };
const PRESSURE = {
  attribute_name: "pressure",
  nb_items: 1,
  min_value: 0,
  max_value: 1,
  time_steps: [0, TIME_STEP, 1],
};
const MISSING_ERROR = `No data with id "${MISSING_ID}"; read vease://data for the loaded data`;

// Every store method is a mock made on first use, so a test reads the setters it expects by name
function styleStoreMock(methods: StyleStoreMock): StyleStoreMock {
  return new Proxy(methods, {
    get(target, key): StoreMethod | undefined {
      if (typeof key !== "string" || key === "then") {
        return undefined;
      }
      target[key] ??= vi.fn<(...args: unknown[]) => unknown>();
      return target[key];
    },
  });
}

function createStores(): Stores {
  const styleMethods: StyleStoreMock = {};
  return {
    styleMethods,
    styleStore: styleStoreMock(styleMethods),
    dataStore: {
      item: vi.fn<(id: string) => Promise<DataItem>>(),
      getMeshComponentGeodeIds: vi.fn<(id: string, type: string) => Promise<string[]>>(),
    },
    hybridViewerStore: { remoteRender: vi.fn<() => Promise<void>>() },
    request: vi.fn<(args: RequestArgs) => Promise<unknown>>(),
  };
}

function answerComponents(stores: Stores, geodeIdsByType: Record<string, string[]>): void {
  stores.dataStore.getMeshComponentGeodeIds.mockImplementation(async (_id, type) => {
    await Promise.resolve();
    return geodeIdsByType[type] ?? [];
  });
}

// Resets the stores for a test: the mesh has points and polygons, the model surfaces s1 and s2
function setupStores(stores: Stores): void {
  for (const name of Object.keys(stores.styleMethods)) {
    Reflect.deleteProperty(stores.styleMethods, name);
  }
  stores.dataStore.getMeshComponentGeodeIds.mockReset();
  stores.hybridViewerStore.remoteRender.mockReset();
  stores.request.mockReset();
  /* oxlint-disable no-unsafe-type-assertion -- established pattern for mocking partial stores */
  vi.mocked(getDataStyleStore).mockReturnValue(
    stores.styleStore as unknown as ReturnType<typeof getDataStyleStore>,
  );
  vi.mocked(getHybridViewerStore).mockReturnValue(
    stores.hybridViewerStore as unknown as ReturnType<typeof getHybridViewerStore>,
  );
  vi.mocked(getBackStore).mockReturnValue({
    request: stores.request,
  } as unknown as ReturnType<typeof getBackStore>);
  vi.mocked(useDataStore).mockReturnValue(
    stores.dataStore as unknown as ReturnType<typeof useDataStore>,
  );
  /* oxlint-enable no-unsafe-type-assertion */
  const items = new Map([MESH, OTHER_MESH, MODEL].map((item) => [item.data_id, item]));
  stores.dataStore.item.mockReset().mockImplementation(async (id) => {
    await Promise.resolve();
    const item = items.get(id);
    if (item === undefined) {
      throw new Error(`Item not found: ${id}`);
    }
    return item;
  });
  stores.styleStore.getStyle?.mockReturnValue({ visibility: true, points: {}, polygons: {} });
  answerComponents(stores, { Surface: ["s1", "s2"] });
}

function answerAttributes(stores: Stores, attributesBySchemaId: Record<string, unknown[]>): void {
  stores.request.mockImplementation(async ({ schema }) => {
    await Promise.resolve();
    return { attributes: attributesBySchemaId[schema.$id] ?? [] };
  });
}

function styleSetter(stores: Stores, name: string): StoreMethod {
  const setter = stores.styleStore[name];
  if (setter === undefined) {
    throw new Error(`No style store method ${name}`);
  }
  return setter;
}

async function runCommand(command: string, params: Record<string, unknown>): Promise<unknown> {
  const handler = controllerHandlers[command];
  if (handler === undefined) {
    throw new Error(`No controller command ${command}`);
  }
  const result = await handler(params);
  return result;
}

// Colors one data by attribute and returns what was applied to it
async function colorOne(
  command: string,
  { id, ...params }: Record<string, unknown>,
): Promise<unknown> {
  const result = await runCommand(command, { ids: [id], ...params });
  return result instanceof Object && "attributes" in result && Array.isArray(result.attributes)
    ? result.attributes[0]
    : result;
}

export {
  DEPTH,
  DEPTH_MAX,
  MESH,
  MISSING_ERROR,
  MISSING_ID,
  MODEL,
  ONCE,
  ORANGE,
  ORANGE_HEX,
  OTHER_MESH,
  PRESSURE,
  TIME_STEP,
  TIME_STEP_INDEX,
  answerAttributes,
  answerComponents,
  colorOne,
  createStores,
  runCommand,
  setupStores,
  styleSetter,
};
export type { StoreMethod, Stores };
