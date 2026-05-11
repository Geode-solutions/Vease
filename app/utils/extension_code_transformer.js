function transformCoreImports(code) {
  let transformedCode = code.replaceAll(
    /from\s+["']vue["']/gu,
    `from "data:text/javascript,${encodeURIComponent(`
      const Vue = globalThis.Vue;
      export default Vue;
      ${Object.keys(globalThis.Vue || {})
        .map((key) => `export const ${key} = Vue.${key};`)
        .join("")}
    `)}"`,
  );

  transformedCode = transformedCode.replaceAll(
    /from\s+["']pinia["']/gu,
    `from "data:text/javascript,${encodeURIComponent(`
      const Pinia = globalThis.Pinia;
      export default Pinia;
      ${Object.keys(globalThis.Pinia || {})
        .map((key) => `export const ${key} = Pinia.${key};`)
        .join("")}
    `)}"`,
  );
  return transformedCode;
}

function transformStoreImports(code) {
  let transformedCode = code.replaceAll(
    /from\s+["']@ogw_front\/app\/stores\/app\.js["']/gu,
    `from "data:text/javascript,${encodeURIComponent(`
        export const useAppStore = globalThis.__VEASE_STORES__.useAppStore;
        export default useAppStore;
      `)}"`,
  );

  transformedCode = transformedCode.replaceAll(
    /from\s+["']@ogw_front\/app\/stores\/([^"']+)["']/gu,
    (match, storePath) => {
      const storeName = storePath.replace(".js", "");
      const capitalizedName = storeName.charAt(0).toUpperCase() + storeName.slice(1);
      return `from "data:text/javascript,${encodeURIComponent(`
        export const use${capitalizedName}Store = globalThis.__VEASE_STORES__.use${capitalizedName}Store;
        export default use${capitalizedName}Store;
      `)}"`;
    },
  );
  return transformedCode;
}

function transformUtilImports(code) {
  let transformedCode = code.replaceAll(
    /from\s+["']@ogw_front\/app\/utils\/status\.js["']/gu,
    `from "data:text/javascript,${encodeURIComponent(`
      const Status = window.__VEASE_UTILS__.Status;
      export { Status };
    `)}"`,
  );

  transformedCode = transformedCode.replaceAll(
    /from\s+["']@ogw_front\/app\/utils\/local\/app_mode\.js["']/gu,
    `from "data:text/javascript,${encodeURIComponent(`
      export const appMode = globalThis.__VEASE_UTILS__.appMode;
    `)}"`,
  );

  transformedCode = transformedCode.replaceAll(
    /from\s+["']@ogw_front\/internal\/utils\/api_fetch\.js["']/gu,
    `from "data:text/javascript,${encodeURIComponent(`
      export const api_fetch = globalThis.__VEASE_UTILS__.api_fetch;
    `)}"`,
  );
  return transformedCode;
}

function transformSchemaImports(code) {
  return code.replaceAll(
    /from\s+["']@geode\/vease-modeling-back\/vease_modeling_back_schemas\.json["']/gu,
    `from "data:text/javascript,${encodeURIComponent(`
      const schemas = globalThis.__VEASE_SCHEMAS__.vease_modeling_back;
      export default schemas;
    `)}"`,
  );
}

function transformGlobalFunctionCalls(code) {
  let transformedCode = code.replaceAll(
    /\buseInfraStore\(/gu,
    "globalThis.__VEASE_STORES__.useInfraStore(",
  );
  transformedCode = transformedCode.replaceAll(
    /\buseAppStore\(/gu,
    "globalThis.__VEASE_STORES__.useAppStore(",
  );
  transformedCode = transformedCode.replaceAll(
    /\buseFeedbackStore\(/gu,
    "globalThis.__VEASE_STORES__.useFeedbackStore(",
  );
  return transformedCode;
}

export function transformExtensionCode(code) {
  let transformedCode = transformCoreImports(code);
  transformedCode = transformStoreImports(transformedCode);
  transformedCode = transformUtilImports(transformedCode);
  transformedCode = transformSchemaImports(transformedCode);
  transformedCode = transformGlobalFunctionCalls(transformedCode);
  return transformedCode;
}

