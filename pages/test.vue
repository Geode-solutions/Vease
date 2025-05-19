<template>
  <div ref="vtk" style="width: 500px; height: 800px; background: black"></div>
</template>

<script setup>
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow.js";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";

import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";

const container = useTemplateRef("vtk");

// Create a full screen renderer window
const fullScreenRenderer = vtkGenericRenderWindow.newInstance({
  background: [0.2, 0.3, 0.4],
});

onMounted(async () => {
  if (process.client) {
    await nextTick();
    fullScreenRenderer.setContainer(container.value);

    fullScreenRenderer.resize();
    console.log("fullScreenRenderer", fullScreenRenderer);
    console.log(
      "_apisepecific",
      fullScreenRenderer.getApiSpecificRenderWindow().getSize()
    );

    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    console.log("renderWindow", renderWindow);
    console.log("renderer", renderer);

    // Create a reader to load the VTP file
    const reader = vtkXMLPolyDataReader.newInstance();

    // await reader.parseAsArrayBuffer();
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
  }
});
</script>
