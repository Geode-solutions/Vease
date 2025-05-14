<template>
  <div ref="container" style="width: 500px; height: 500px"></div>
</template>

<script setup>
import "@kitware/vtk.js/Rendering/Profiles/Geometry";

import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
// import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";

import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow";
import vtkCamera from "@kitware/vtk.js/Rendering/Core/Camera";
// import vtkHttpDataSetReader from "@kitware/vtk.js/IO/Core/HttpDataSetReader";
// import vtkWindowedSincPolyDataFilter from "@kitware/vtk.js/Filters/General/WindowedSincPolyDataFilter";

const container = useTemplateRef("container");

onMounted(() => {
  const genericRenderWindow = vtkGenericRenderWindow.newInstance({});

  genericRenderWindow.setBackground([0.3, 0.5, 0]);
  genericRenderWindow.setContainer(container.value);
  const renderer = vtkRenderer.newInstance();
  const renderWindow = genericRenderWindow.getRenderWindow();

  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();
  const camera = vtkCamera.newInstance();

  actor.setMapper(mapper);
  renderer.addActor(actor);

  renderWindow.render();
});
</script>
