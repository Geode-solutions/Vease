import {
  setColor,
  setColorWithSlider,
  setColoringStyle,
  setOpacity,
} from "@tests/utils/helpers/color.js";

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
