/* oxlint-disable typescript/no-unsafe-type-assertion */
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import type { MicroserviceId } from "@ogw_front/types/identifiers";
import type { MicroserviceStatus } from "@ogw_front/utils/status";
import type { PackageVersion } from "@ogw_front/types/server";
import type { Url } from "@ogw_front/types/files";
import { useBackStore } from "@ogw_front/stores/back";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useInfraStore } from "@ogw_front/stores/infra";

interface ApiSchema {
  $id: string;
  [key: string]: unknown;
}

interface ApiCallbacks {
  response_function?: (response: unknown) => unknown;
  request_error_function?: (error: unknown) => unknown;
  response_error_function?: (response: unknown) => unknown;
}

interface BackStoreExtra {
  base_url: Url;
  request: (
    args: { schema: ApiSchema; params?: Record<string, unknown> },
    callbacks?: ApiCallbacks,
  ) => Promise<unknown>;
}

function getBackStore(): ReturnType<typeof useBackStore> & BackStoreExtra {
  return useBackStore() as unknown as ReturnType<typeof useBackStore> & BackStoreExtra;
}

interface HybridViewerStoreExtra {
  remoteRender: () => Promise<void> | undefined;
  focusCameraOnObject: (id: DataId) => unknown;
  removeItem: (id: DataId) => unknown;
}

function getHybridViewerStore(): ReturnType<typeof useHybridViewerStore> & HybridViewerStoreExtra {
  return useHybridViewerStore();
}

interface MicroserviceStore {
  $id: MicroserviceId;
  status: MicroserviceStatus;
  version?: PackageVersion;
  is_busy?: boolean;
  get_version?: (schema?: unknown) => unknown;
  [key: string]: unknown;
}

interface InfraStoreExtra {
  microservices: MicroserviceStore[];
  microservices_connected: boolean;
  microservices_busy: boolean;
  register_microservice: (store: unknown) => void;
  unregister_microservice: (microserviceId: MicroserviceId) => void;
  create_connection: () => Promise<void>;
}

function getInfraStore(): Omit<ReturnType<typeof useInfraStore>, keyof InfraStoreExtra> &
  InfraStoreExtra {
  return useInfraStore() as unknown as Omit<
    ReturnType<typeof useInfraStore>,
    keyof InfraStoreExtra
  > &
    InfraStoreExtra;
}

interface DataStyleStoreExtra {
  setVisibility: (id: DataId, visible: boolean, item?: unknown) => unknown;
}

function getDataStyleStore(): ReturnType<typeof useDataStyleStore> & DataStyleStoreExtra {
  return useDataStyleStore();
}

export type {
  ApiSchema,
  HybridViewerStoreExtra,
  MicroserviceStore,
  InfraStoreExtra,
  DataStyleStoreExtra,
};
export { getBackStore, getHybridViewerStore, getInfraStore, getDataStyleStore };
