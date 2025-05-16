<template>
  <div id="vtkViewer" style="width: 800px; height: 800px"></div>
</template>

<script setup>
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";

import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";

// Create a full screen renderer window
const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0.2, 0.3, 0.4],
  rootContainer: document.getElementById("vtkViewer"),
});

const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// Create a reader to load the VTP file
const reader = vtkXMLPolyDataReader.newInstance();

await reader.setUrl("/pages/polygon_attribute.vtp");
const polydata = reader.getOutputData(0);
console.log("polydata", polydata);

const mapper = vtkMapper.newInstance();
mapper.setInputData(polydata);

const actor = vtkActor.newInstance();
actor.setMapper(mapper);

// Add the actor to the renderer and render the scene
renderer.addActor(actor);
renderer.resetCamera();
renderWindow.render();
</script>
