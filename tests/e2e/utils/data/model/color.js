import {
  setColor,
  setColorWithSlider,
  setColoringStyle,
  setOpacity,
<<<<<<<< HEAD:tests/e2e/utils/data/model/color.js
} from "vease/tests/e2e/utils/data/helpers/color.js";
========
} from "@tests/utils/helpers/color";
>>>>>>>> 077a2b111249c4084a9c0f8cdbeb3050312354a3:tests/e2e/utils/data/model/color.ts

function setModelOpacity(window, percent) {
  return setOpacity(window, "modelStyleMenu", percent);
}

function setModelColor(window) {
  return setColor(window, "modelStyleMenu");
}

function setModelColorWithSlider(window) {
  return setColorWithSlider(window, "modelStyleMenu");
}

function setModelColoringStyle(window, style) {
  return setColoringStyle(window, "modelStyleMenu", style);
}

export { setModelColor, setModelColorWithSlider, setModelColoringStyle, setModelOpacity };
