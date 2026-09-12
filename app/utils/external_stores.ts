// Typed access helpers for Pinia stores shipped by @geode/opengeodeweb-front.
// These external stores are plain JavaScript, and Pinia's type inference collapses some of them to weak or empty types.
// The helpers below document the additional surface Vease relies on at runtime and cast to it once, instead of scattering `as any` across call sites.
import { useBackStore } from "@ogw_front/stores/back";
import { useDataStyleStore } from "@ogw_front/stores/data_style";
import { useHybridViewerStore } from "@ogw_front/stores/hybrid_viewer";
import { useInfraStore } from "@ogw_front/stores/infra";
import { useViewerStore } from "@ogw_front/stores/viewer";

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

function getBackStore() {
  return useBackStore() as unknown as ReturnType<typeof useBackStore> & BackStoreExtra;
}

interface HybridViewerStoreExtra {
  remoteRender: () => Promise<void> | undefined;
  focusCameraOnObject: (id: string) => unknown;
  removeItem: (id: string) => Promise<unknown> | unknown;
}

function getHybridViewerStore() {
  return useHybridViewerStore() as unknown as ReturnType<typeof useHybridViewerStore> &
    HybridViewerStoreExtra;
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

function getInfraStore() {
  return useInfraStore() as unknown as Omit<
    ReturnType<typeof useInfraStore>,
    keyof InfraStoreExtra
  > &
    InfraStoreExtra;
}

interface DataStyleStoreExtra {
  mutateMeshPointsVisibility: (payload: unknown) => void;
  setVisibility: (id: string, visible: boolean, item?: unknown) => Promise<unknown> | unknown;
}

function getDataStyleStore() {
  return useDataStyleStore() as unknown as ReturnType<typeof useDataStyleStore> &
    DataStyleStoreExtra;
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

function getViewerClient(viewerStore: ReturnType<typeof useViewerStore>) {
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
export {
  getBackStore,
  getHybridViewerStore,
  getInfraStore,
  getDataStyleStore,
  getViewerClient,
};
