import { check_recaptcha_params } from "./recaptcha.js";

exports.handler = async function (event) {
  const { name, email, launch } = event.queryStringParameters.name;
  return check_recaptcha_params(name, email, launch);
};
