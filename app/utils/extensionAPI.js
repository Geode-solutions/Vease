import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json"
import vease_back_schemas from "@geode/vease-back/vease_back_schemas.json"
import { importItem } from "@ogw_front/utils/file_import_workflow.js"
import { useAppStore } from "@ogw_front/stores/app"
import { useFeedbackStore } from "@ogw_front/stores/feedback"
import { useGeodeStore } from "@ogw_front/stores/geode"

export class VeaseExtensionAPI {
  registerTool(extensionId, toolDefinition) {
    if (!toolDefinition.id) {
      throw new Error("Tool definition must have an id")
    }
    if (!toolDefinition.component) {
      throw new Error("Tool definition must have a component")
    }

    useUIStore().registerToolComponent(toolDefinition, extensionId)
  }

  unregisterTool(toolId) {
    useUIStore().unregisterTool(toolId)
  }

  unregisterToolsByExtension(extensionId) {
    useUIStore().unregisterToolsByExtension(extensionId)
  }

  getSchemas() {
    return {
      opengeodeweb_back: back_schemas.opengeodeweb_back,
      vease_back: vease_back_schemas.vease_back,
    }
  }

  async api_fetch(
    { schema, params },
    { request_error_function, response_function, response_error_function } = {},
  ) {
    const validate_schema = (
      await import("@ogw_front/utils/validate_schema.js")
    ).default
    const feedbackStore = useFeedbackStore()
    const geodeStore = useGeodeStore()

    const body = params || {}

    const { valid, error } = validate_schema(schema, body)

    if (!valid) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Bad request", error, schema, params)
      }
      feedbackStore.add_error(400, schema.$id, "Bad request", error)
      throw new Error(schema.$id.concat(": ", error))
    }

    geodeStore.start_request()

    const method = schema.methods.filter((m) => m !== "OPTIONS")[0]
    const requestOptions = {
      method: method,
      baseURL: geodeStore.base_url,
    }

    if (body && Object.keys(body).length > 0) {
      requestOptions.body = body
    }

    try {
      const response = await $fetch(schema.$id, requestOptions)
      await geodeStore.stop_request()

      if (response_function) {
        await response_function({ _data: response, ok: true })
      }

      return { data: { value: response } }
    } catch (error) {
      await geodeStore.stop_request()

      if (error.response) {
        await feedbackStore.add_error(
          error.response.status,
          schema.$id,
          error.response._data?.name || "Error",
          error.response._data?.description || error.message,
        )
        if (response_error_function) {
          await response_error_function(error.response)
        }
      } else {
        await feedbackStore.add_error(
          error.code || 500,
          schema.$id,
          error.message,
          error.stack,
        )
        if (request_error_function) {
          await request_error_function(error)
        }
      }

      throw error
    }
  }

  importItem(item) {
    return importItem(item)
  }

  registerStore(store) {
    const appStore = useAppStore()
    appStore.registerStore(store)
  }

  get UIStore() {
    return useUIStore()
  }

  get DataBaseStore() {
    return useDataBaseStore()
  }

  get HybridViewerStore() {
    return useHybridViewerStore()
  }

  get AppStore() {
    return useAppStore()
  }
}
