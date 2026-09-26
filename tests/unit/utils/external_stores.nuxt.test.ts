import { describe, expect, test, vi } from "vitest";
import {
  getBackStore,
  getDataStyleStore,
  getHybridViewerStore,
  getInfraStore,
  getViewerClient,
} from "@vease/utils/external_stores";
import { useBackStore } from "@ogw_front/stores/back";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useInfraStore } from "@ogw_front/stores/infra";

vi.setConfig({ testTimeout: 10_000 });

vi.mock(import("@ogw_front/stores/back"), () => ({ useBackStore: vi.fn<typeof useBackStore>() }));
vi.mock(import("@ogw_front/stores/data_style"), () => ({
  useDataStyleStore: vi.fn<typeof useDataStyleStore>(),
}));
vi.mock(import("@ogw_front/stores/hybrid_viewer"), () => ({
  useHybridViewerStore: vi.fn<typeof useHybridViewerStore>(),
}));
vi.mock(import("@ogw_front/stores/infra"), () => ({
  useInfraStore: vi.fn<typeof useInfraStore>(),
}));

describe("external_stores", () => {
  test("getBackStore returns whatever useBackStore returns", () => {
    const sentinel = { base_url: "http://localhost", request: vi.fn<() => Promise<unknown>>() };
    // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
    vi.mocked(useBackStore).mockReturnValue(sentinel as unknown as ReturnType<typeof useBackStore>);

    expect(getBackStore()).toBe(sentinel);
  });

  test("getDataStyleStore returns whatever useDataStyleStore returns", () => {
    const sentinel = { setVisibility: vi.fn<(id: string, visible: boolean) => void>() };
    vi.mocked(useDataStyleStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
      sentinel as unknown as ReturnType<typeof useDataStyleStore>,
    );

    expect(getDataStyleStore()).toBe(sentinel);
  });

  test("getHybridViewerStore returns whatever useHybridViewerStore returns", () => {
    const sentinel = { remoteRender: vi.fn<() => Promise<void>>() };
    vi.mocked(useHybridViewerStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
      sentinel as unknown as ReturnType<typeof useHybridViewerStore>,
    );

    expect(getHybridViewerStore()).toBe(sentinel);
  });

  test("getInfraStore returns whatever useInfraStore returns", () => {
    const sentinel = {
      microservices: [],
      register_microservice: vi.fn<(store: unknown) => void>(),
    };
    vi.mocked(useInfraStore).mockReturnValue(
      // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
      sentinel as unknown as ReturnType<typeof useInfraStore>,
    );

    expect(getInfraStore()).toBe(sentinel);
  });

  test("getViewerClient reads the client off the given viewer store", () => {
    const client = { getConnection: vi.fn<() => unknown>() };
    // oxlint-disable-next-line no-unsafe-type-assertion -- established pattern for mocking a partial store/return type, see tests/unit/server/utils/data_file.nuxt.test.ts
    const viewerStore = { client } as unknown as Parameters<typeof getViewerClient>[0];

    expect(getViewerClient(viewerStore)).toBe(client);
  });
});
