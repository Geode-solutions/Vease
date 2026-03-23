//oxlint-disable import/no-commonjs
//oxlint-disable oxc/func-names
//oxlint-disable unicorn/prefer-module

import { check_recaptcha_params } from "@geode/opengeodeweb-front/app/utils/recaptcha.js";
console.log("Module recaptcha chargé – top level log");

// oxlint-disable-next-line require-await
exports.handler = async function (event) {
  console.log("body", event.body);
  const { name, email, launch } = JSON.parse(event.body);
  console.log(name, email, launch);
  const result = check_recaptcha_params(name, email, launch);
  console.log({ result });
  return result;
};
