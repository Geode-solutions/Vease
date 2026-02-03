import { check_recaptcha_params } from "@geode/opengeodeweb-front/app/utils/recaptcha.js"

export async function handler(event) {
  console.log("handler", { event })
  return await check_recaptcha_params(event)
}
