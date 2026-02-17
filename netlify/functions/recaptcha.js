import { check_recaptcha_params } from "@geode/opengeodeweb-front/app/utils/recaptcha.js"

exports.handler = async function (event) {
  const { name, email, launch } = JSON.parse(event.body)
  return check_recaptcha_params(name, email, launch)
}
