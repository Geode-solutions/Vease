import type * as PiniaModule from "pinia";
import type * as VueModule from "vue";
import type { useAppStore } from "@ogw_front/stores/app";
import type { useBackStore } from "@ogw_front/stores/back";
import type { useFeedbackStore } from "@ogw_front/stores/feedback";
import type { useInfraStore } from "@ogw_front/stores/infra";

declare global {
  // eslint-disable-next-line no-var
  var Vue: typeof VueModule | undefined;
  // eslint-disable-next-line no-var
  var Pinia: typeof PiniaModule | undefined;
  // eslint-disable-next-line no-var
  var __VEASE_STORES__:
    | {
        useAppStore: typeof useAppStore;
        useInfraStore: typeof useInfraStore;
        useFeedbackStore: typeof useFeedbackStore;
        useBackStore: typeof useBackStore;
      }
    | undefined;
  // eslint-disable-next-line no-var
  var __VEASE_UTILS__:
    | {
        Status: unknown;
        appMode: unknown;
        api_fetch: unknown;
      }
    | undefined;
  // eslint-disable-next-line no-var
  var __VEASE_SCHEMAS__: Record<string, unknown> | undefined;
}
