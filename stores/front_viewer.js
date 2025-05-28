import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow.js";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";

import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import Status from "@ogw_f/utils/status.js";

export const useFrontViewerStore = defineStore("frontViewer", () => {
  const viewer_store = use_viewer_store();

  /** State **/
  const db = reactive({});
  const status = ref(Status.NOT_CREATED);
  const camera_options = reactive({});
  let genericRenderWindow;
  let viewStream;

  /** Watchers **/
  watch(
    () => viewer_store.status,
    (value) => {
      console.log("value", value);
      if (value == Status.CONNECTED && status.value == Status.CREATED) {
        viewStream = viewer_store.client
          .getImageStream()
          .createViewStream("-1");

        viewStream.onImageReady((e) => {
          const webGLRenderWindow =
            genericRenderWindow.getApiSpecificRenderWindow();
          const imageStyle =
            webGLRenderWindow.getReferenceByName("bgImage").style;
          webGLRenderWindow.setBackgroundImage(e.image);
          imageStyle.opacity = 1;
          console.log("imageStyle", Date.now());
        });
      }
    },
    { immediate: true }
  );

  watch(
    () => db,
    (value) => {
      console.log("frontViewer watch db", value);
      for (const id in value) {
        addItem(id, value[id]);
      }
    },
    { deep: true }
  );

  /** Actions **/
  async function initFrontViewer() {
    console.log("initFrontViewer");
    status.value = Status.CREATING;
    genericRenderWindow = vtkGenericRenderWindow.newInstance({
      background: [180 / 255, 180 / 255, 180 / 255],
      listenWindowResize: false,
    });
    const webGLRenderWindow = genericRenderWindow.getApiSpecificRenderWindow();
    console.log("initFrontViewer webGLRenderWindow", webGLRenderWindow);

    const imageStyle = webGLRenderWindow.getReferenceByName("bgImage").style;
    console.log("imageStyle", imageStyle);
    imageStyle.transition = "opacity 0.1s ease-in";
    imageStyle.zIndex = 1;
    status.value = Status.CREATED;
  }

  async function addItem(id, value) {
    console.log("frontViewer.addItem", id, value);
    const reader = vtkXMLPolyDataReader.newInstance();
    const textEncoder = new TextEncoder();
    await reader.parseAsArrayBuffer(
      textEncoder.encode(value.binary_light_viewable)
    );
    const polydata = reader.getOutputData(0);
    console.log("polydata", polydata);
    const mapper = vtkMapper.newInstance();
    mapper.setInputData(polydata);
    const actor = vtkActor.newInstance();
    console.log("actor", actor);
    actor.setMapper(mapper);

    const renderer = genericRenderWindow.getRenderer();
    const renderWindow = genericRenderWindow.getRenderWindow();

    renderer.addActor(actor);
    renderer.resetCamera();
    renderWindow.render();

    db[id].actor = actor;
    db[id].mapper = mapper;
    db[id].polydata = polydata;
  }
  function syncRemoteCamera() {
    const renderer = genericRenderWindow.getRenderer();
    const camera = renderer.getActiveCamera();
    const params = {
      camera_options: {
        focal_point: camera.getFocalPoint(),
        view_up: camera.getViewUp(),
        position: camera.getPosition(),
        view_angle: camera.getViewAngle(),
        clipping_range: camera.getClippingRange(),
        distance: camera.getDistance(),
      },
    };
    viewer_call(
      {
        schema: viewer_schemas.opengeodeweb_viewer.viewer.update_camera,
        params,
      },
      {
        response_fonction: () => {
          for (const key in params.camera_options) {
            camera_options[key] = params.camera_options[key];
          }
          console.log("camera_options", camera_options);
        },
      }
    );
  }

  function setContainer(container) {
    console.log("frontViewer.setContainer", container);
    genericRenderWindow.setContainer(container.value.$el);
    const webGLRenderWindow = genericRenderWindow.getApiSpecificRenderWindow();
    webGLRenderWindow.setUseBackgroundImage(true);
    const imageStyle = webGLRenderWindow.getReferenceByName("bgImage").style;
    console.log("imageStyle", imageStyle);
    useMousePressed({
      target: container,
      onPressed: () => {
        imageStyle.opacity = 0;
      },
      onReleased: () => {
        syncRemoteCamera();
      },
    });
  }

  async function resize(width, height) {
    console.log("frontViewer.resize", width, height);
    const webGLRenderWindow = genericRenderWindow.getApiSpecificRenderWindow();
    console.log("frontViewer.resize webGLRenderWindow", webGLRenderWindow);
    const canvas = webGLRenderWindow.getCanvas();
    canvas.width = 0;
    canvas.height = 0;
    await nextTick();
    webGLRenderWindow.setSize(width, height);
    console.log("frontViewer.resize viewStream", viewStream);
    viewStream.setSize(width, height);
    const renderWindow = webGLRenderWindow.getRenderWindow();
    renderWindow.render();
  }

  return {
    db,
    genericRenderWindow,
    addItem,
    initFrontViewer,
    resize,
    setContainer,
  };
});
