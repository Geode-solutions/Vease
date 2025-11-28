export function transformExtensionCode(code) {
  code = code.replace(
    /from\s+["']vue["']/g,
    'from "data:text/javascript,' + encodeURIComponent(`
      const Vue = window.Vue;
      export default Vue;
      ${Object.keys(window.Vue || {}).map(key => `export const ${key} = Vue.${key};`).join('')}
    `) + '"'
  )

  code = code.replace(
    /from\s+["']pinia["']/g,
    'from "data:text/javascript,' + encodeURIComponent(`
      const Pinia = window.Pinia;
      export default Pinia;
      ${Object.keys(window.Pinia || {}).map(key => `export const ${key} = Pinia.${key};`).join('')}
    `) + '"'
  )

  return code
}
