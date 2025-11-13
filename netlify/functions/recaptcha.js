import { check_recaptcha_params } from "@geode/opengeodeweb-front/utils/recaptcha.js"

exports.handler = async function (event) {
  console.log("handler", { event })
  return check_recaptcha_params(event)
}
