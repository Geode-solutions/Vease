/* oxlint-disable typescript/no-unsafe-type-assertion */
import { useBackStore } from "@ogw_front/stores/back";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useInfraStore } from "@ogw_front/stores/infra";
import type { useViewerStore } from "@ogw_front/stores/viewer";

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
  base_url: string;
  request: (
    args: { schema: ApiSchema; params?: Record<string, unknown> },
    callbacks?: ApiCallbacks,
  ) => Promise<unknown>;
}

function getBackStore(): ReturnType<typeof useBackStore> & BackStoreExtra {
  return useBackStore();
}

interface HybridViewerStoreExtra {
  remoteRender: () => Promise<void> | undefined;
  focusCameraOnObject: (id: string) => unknown;
  removeItem: (id: string) => unknown;
}

function getHybridViewerStore(): ReturnType<typeof useHybridViewerStore> & HybridViewerStoreExtra {
  return useHybridViewerStore();
}

interface MicroserviceStore {
  $id: string;
  status: string;
  version?: string;
  is_busy?: boolean;
  get_version?: (schema?: unknown) => unknown;
  [key: string]: unknown;
}

interface InfraStoreExtra {
  microservices: MicroserviceStore[];
  microservices_connected: boolean;
  microservices_busy: boolean;
  register_microservice: (store: unknown) => void;
  unregister_microservice: (microserviceId: string) => void;
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
  setVisibility: (id: string, visible: boolean, item?: unknown) => unknown;
}

function getDataStyleStore(): ReturnType<typeof useDataStyleStore> & DataStyleStoreExtra {
  return useDataStyleStore();
}

interface ViewerSession {
  subscribe: (eventName: string, callback: (args: unknown[]) => void) => void;
}

interface ViewerConnection {
  getSession: () => ViewerSession;
}

interface ViewerClient {
  getConnection: () => ViewerConnection;
}

function getViewerClient(viewerStore: ReturnType<typeof useViewerStore>): ViewerClient {
  return viewerStore.client as unknown as ViewerClient;
}

export type {
  ApiSchema,
  ApiCallbacks,
  BackStoreExtra,
  HybridViewerStoreExtra,
  MicroserviceStore,
  InfraStoreExtra,
  DataStyleStoreExtra,
  ViewerSession,
  ViewerConnection,
  ViewerClient,
};
export { getBackStore, getHybridViewerStore, getInfraStore, getDataStyleStore, getViewerClient };
