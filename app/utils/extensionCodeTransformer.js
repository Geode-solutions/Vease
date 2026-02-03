export function transformExtensionCode(code) {
  let transformedCode = code.replaceAll(
    /from\s+["']vue["']/g,
    `from "data:text/javascript,${encodeURIComponent(`
      const Vue = window.Vue;
      export default Vue;
      ${Object.keys(window.Vue || {})
        .map((key) => `export const ${key} = Vue.${key};`)
        .join("")}
    `)}"`,
  )

  transformedCode = transformedCode.replaceAll(
    /from\s+["']pinia["']/g,
    `from "data:text/javascript,${encodeURIComponent(`
      const Pinia = window.Pinia;
      export default Pinia;
      ${Object.keys(window.Pinia || {})
        .map((key) => `export const ${key} = Pinia.${key};`)
        .join("")}
    `)}"`,
  )

  // Transform @ogw_front/app/stores/app.js specifically
  transformedCode = transformedCode.replaceAll(
    /from\s+["']@ogw_front\/app\/stores\/app\.js["']/g,
    `from "data:text/javascript,${encodeURIComponent(`
        export const useAppStore = window.__VEASE_STORES__.useAppStore;
        export default useAppStore;
      `)}"`,
  )

  // Transform @ogw_front/app/stores/* imports (generic pattern)
  transformedCode = transformedCode.replaceAll(
    /from\s+["']@ogw_front\/app\/stores\/([^"']+)["']/g,
    (match, storePath) => {
      const storeName = storePath.replace(".js", "")
      const capitalizedName =
        storeName.charAt(0).toUpperCase() + storeName.slice(1)
      return `from "data:text/javascript,${encodeURIComponent(`
        export const use${capitalizedName}Store = window.__VEASE_STORES__.use${capitalizedName}Store;
        export default use${capitalizedName}Store;
      `)}"`
    },
  )

  // Transform @ogw_front/app/utils/status.js
  transformedCode = transformedCode.replaceAll(
    /from\s+["']@ogw_front\/app\/utils\/status\.js["']/g,
    `from "data:text/javascript,${encodeURIComponent(`
      const Status = window.__VEASE_UTILS__.Status;
      export default Status;
    `)}"`,
  )

  // Transform @ogw_front/app/utils/app_mode.js
  transformedCode = transformedCode.replaceAll(
    /from\s+["']@ogw_front\/app\/utils\/app_mode\.js["']/g,
    `from "data:text/javascript,${encodeURIComponent(`
      export const appMode = window.__VEASE_UTILS__.appMode;
    `)}"`,
  )

  // Transform @ogw_front/internal/utils/api_fetch.js (actual path in OpenGeodeWeb-Front)
  transformedCode = transformedCode.replaceAll(
    /from\s+["']@ogw_front\/internal\/utils\/api_fetch\.js["']/g,
    `from "data:text/javascript,${encodeURIComponent(`
      export const api_fetch = window.__VEASE_UTILS__.api_fetch;
    `)}"`,
  )

  // Transform @geode/vease-modeling-back/vease_modeling_back_schemas.json
  transformedCode = transformedCode.replaceAll(
    /from\s+["']@geode\/vease-modeling-back\/vease_modeling_back_schemas\.json["']/g,
    `from "data:text/javascript,${encodeURIComponent(`
      const schemas = window.__VEASE_SCHEMAS__.vease_modeling_back;
      export default schemas;
    `)}"`,
  )

  // Replace direct function calls to use window globals
  // This handles cases where functions are externalized and called without imports
  transformedCode = transformedCode.replaceAll(
    /\buseInfraStore\(/g,
    "window.__VEASE_STORES__.useInfraStore(",
  )
  transformedCode = transformedCode.replaceAll(
    /\buseAppStore\(/g,
    "window.__VEASE_STORES__.useAppStore(",
  )
  transformedCode = transformedCode.replaceAll(
    /\buseFeedbackStore\(/g,
    "window.__VEASE_STORES__.useFeedbackStore(",
  )

  return transformedCode
}
