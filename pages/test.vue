<template>
  <v-card
    ref="cardContainer"
    style="height: calc(100vh - 85px); width: 100%; border-radius: 15px"
  >
    <v-col ref="vtk" class="pa-0" style="width: 100%; height: 100%" />
  </v-card>
</template>

<script setup>
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow.js";

const dataBaseStore = useDataBaseStore();
const container = useTemplateRef("vtk");
const viewer_store = use_viewer_store();

let camera = null;

const genericRenderWindow = vtkGenericRenderWindow.newInstance({
  // background: [180 / 255, 180 / 255, 180 / 255],
  background: [0.2, 0.3, 0.4],
  listenWindowResize: false,
});

const renderer = genericRenderWindow.getRenderer();
const renderWindow = genericRenderWindow.getRenderWindow();

console.log("renderWindow", renderWindow);
console.log("renderer", renderer);

const { width, height } = useElementSize(container);
console.log("genericRenderWindow", genericRenderWindow);
onMounted(async () => {
  if (process.client) {
    await nextTick();
    genericRenderWindow.setContainer(container.value.$el);
    // genericRenderWindow.resize();
    resize();

    const viewStream = viewer_store.client
      .getImageStream()
      .createViewStream("-1");
    console.log("seviewStreamssion", viewStream);
    const webGLRenderWindow = genericRenderWindow.getApiSpecificRenderWindow();
    // webGLRenderWindow.setUseBackgroundImage(true);
    // viewStream.onImageReady((e) => {
    //   webGLRenderWindow.setBackgroundImage(e.image);
    //   webGLRenderWindow.setUseOffScreen(true);
    // });
  }
});

watch(
  () => dataBaseStore.db,
  (value) => {
    console.log("watch value", value);
    for (const id in value) {
      // console.log("id_value", id_value);
      // const light_viewable = id_value.vtk.binary_light_viewable;
      // console.log("light_viewable", light_viewable);
      addLightViewable(id);
    }
  },
  { deep: true }
);

async function addLightViewable(id) {
  const vtk_js = dataBaseStore.db[id].vtk_js;
  const actor = vtk_js.actor;
  // const mapper = vtk_js.mapper;
  // const polydata = vtk_js.polydata;

  console.log("actor", actor);
  // Add the actor to the renderer and render the scene
  renderer.addActor(actor);
  renderer.resetCamera();

  console.log("renderer getActors length before", renderer.getActors().length);
  renderWindow.render();
  camera = renderer.getActiveCamera();
  console.log("camera.getFocalPoint", camera.getFocalPoint());
  console.log("camera.getViewUp", camera.getViewUp());
  console.log("camera.getPosition", camera.getPosition());
  console.log("camera.getViewAngle", camera.getViewAngle());
  console.log("camera.getClippingRange", camera.getClippingRange());
  console.log("camera.getDistance", camera.getDistance());
  // console.log("renderWindow size", renderWindow.getSize());

  console.log("renderer getActors length after", renderer.getActors().length);

  const webGLRenderWindow = genericRenderWindow.getApiSpecificRenderWindow();

  // setTimeout(() => {
  //   webGLRenderWindow.setUseOffScreen(true);
  // }, 5000);

  // setTimeout(() => {
  //   webGLRenderWindow.setUseOffScreen(false);
  // }, 7000);
}

const { width: windowWidth, height: windowHeight } = useWindowSize();

async function resize() {
  const webGLRenderWindow = genericRenderWindow.getApiSpecificRenderWindow();
  const canvas = webGLRenderWindow.getCanvas();
  canvas.width = 0;
  canvas.height = 0;
  await nextTick();
  webGLRenderWindow.setSize(width.value, height.value);
  renderWindow.render();
}
watch([windowWidth, windowHeight, height, width], () => {
  resize();
});

const { pressed } = useMousePressed({ target: container });

watch(
  renderer,
  (value, oldValue) => {
    console.log("watch renderer", value, oldValue);
  },
  { deep: true }
);
watch(pressed, (value) => {
  //   // if (value) {
  //   //   console.log("watch watch camera", camera);
  //   //   renderer.setActiveCamera(camera);
  //   // } else {
  //   //   camera = renderer.getActiveCamera();
  //   // }
  //   console.log("value", value);
  console.log("pressed", value);
  const webGLRenderWindow = genericRenderWindow.getApiSpecificRenderWindow();
  webGLRenderWindow.setUseOffScreen(!value);
  //   // renderWindow.render();

  //   console.log("renderer getActors length", renderer.getActors().length);

  //   const current_camera = renderer.getActiveCamera();

  //   console.log("current_camera.getFocalPoint", current_camera.getFocalPoint());
  //   console.log("current_camera.getViewUp", current_camera.getViewUp());
  //   console.log("current_camera.getPosition", current_camera.getPosition());
  //   console.log("current_camera.getViewAngle", current_camera.getViewAngle());
  //   console.log(
  //     "current_camera.getClippingRange",
  //     current_camera.getClippingRange()
  //   );
  //   console.log("current_camera.getDistance", current_camera.getDistance());
  //   // renderer.resetCamera();
  //   // console.log("renderWindow size", renderWindow.getSize());
});
</script>
