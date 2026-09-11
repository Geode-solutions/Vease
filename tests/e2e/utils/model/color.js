import {
  copyColor,
  pasteColorInput,
  setColor,
  setColorInput,
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

function copyModelPointsColor(window) {
  return copyColor(window, "modelStyleMenu");
}

function setModelPointsColorInput(window, colorText) {
  return setColorInput(window, "modelStyleMenu", colorText);
}

function pasteModelPointsColorInput(window) {
  return pasteColorInput(window, "modelStyleMenu");
}

function copyModelEdgesColor(window) {
  return copyColor(window, "modelStyleMenu");
}

function setModelEdgesColorInput(window, colorText) {
  return setColorInput(window, "modelStyleMenu", colorText);
}

function pasteModelEdgesColorInput(window) {
  return pasteColorInput(window, "modelStyleMenu");
}

function copyModelPolygonsColor(window) {
  return copyColor(window, "modelStyleMenu");
}

function setModelPolygonsColorInput(window, colorText) {
  return setColorInput(window, "modelStyleMenu", colorText);
}

function pasteModelPolygonsColorInput(window) {
  return pasteColorInput(window, "modelStyleMenu");
}

function copyModelPolyhedraColor(window) {
  return copyColor(window, "modelStyleMenu");
}

function setModelPolyhedraColorInput(window, colorText) {
  return setColorInput(window, "modelStyleMenu", colorText);
}

function pasteModelPolyhedraColorInput(window) {
  return pasteColorInput(window, "modelStyleMenu");
}

export {
  copyModelEdgesColor,
  copyModelPointsColor,
  copyModelPolygonsColor,
  copyModelPolyhedraColor,
  pasteModelEdgesColorInput,
  pasteModelPointsColorInput,
  pasteModelPolygonsColorInput,
  pasteModelPolyhedraColorInput,
  setModelColor,
  setModelColorWithSlider,
  setModelColoringStyle,
  setModelEdgesColorInput,
  setModelOpacity,
  setModelPointsColorInput,
  setModelPolygonsColorInput,
  setModelPolyhedraColorInput,
};
