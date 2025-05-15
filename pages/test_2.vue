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

// reader.setFileName("./polygon_attribute.vtp");

// Fetch and parse the VTP file
fetch("./polygon_attribute.vtp")
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => {
    console.log("arrayBuffer", arrayBuffer);
    const textEncoder = new TextEncoder();
    reader.parseAsArrayBuffer(textEncoder.encode(arrayBuffer));
    // reader.parseAsArrayBuffer(arrayBuffer);
    console.log("out");

    // Get the output data and set up the mapper and actor
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
  });
</script>
