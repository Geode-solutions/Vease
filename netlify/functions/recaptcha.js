import { check_recaptcha_params } from "@geode/opengeodeweb-front/utils/recaptcha.js"

exports.handler = async function (event) {
  const { name, email, launch } = event.queryStringParameters
  return check_recaptcha_params(name, email, launch)
}
