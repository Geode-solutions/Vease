import { check_recaptcha_params } from "@geode/opengeodeweb-front/utils/recaptcha.js"

exports.handler = function (event) {
  console.log("handler", { event })
  const { name, email, launch } = event.body
  return check_recaptcha_params(name, email, launch)
}
