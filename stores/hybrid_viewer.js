import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow.js";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";

import viewer_schemas from "@geode/opengeodeweb-viewer/schemas.json";
import Status from "@ogw_f/utils/status.js";

export const useHybridViewerStore = defineStore("hydridViewer", () => {
  const viewer_store = use_viewer_store();

  /** State **/
  const db = reactive({});
  const status = ref(Status.NOT_CREATED);
  const camera_options = reactive({});
  const genericRenderWindow = reactive({});
  const is_moving = ref(false);
  let viewStream;

  /** Actions **/
  async function initHybridViewer() {
    if (status.value != Status.NOT_CREATED) return;

    status.value = Status.CREATING;
    genericRenderWindow.value = vtkGenericRenderWindow.newInstance({
      background: [180 / 255, 180 / 255, 180 / 255],
      listenWindowResize: false,
    });

    const webGLRenderWindow =
      genericRenderWindow.value.getApiSpecificRenderWindow();

    const imageStyle = webGLRenderWindow.getReferenceByName("bgImage").style;
    imageStyle.transition = "opacity 0.1s ease-in";
    imageStyle.zIndex = 1;

    await viewer_store.ws_connect();
    viewStream = viewer_store.client.getImageStream().createViewStream("-1");
    viewStream.onImageReady((e) => {
      if (is_moving.value) return;
      const webGLRenderWindow =
        genericRenderWindow.value.getApiSpecificRenderWindow();
      const imageStyle = webGLRenderWindow.getReferenceByName("bgImage").style;
      webGLRenderWindow.setBackgroundImage(e.image);
      imageStyle.opacity = 1;
    });
    status.value = Status.CREATED;
  }

  async function addItem(id, value) {
    const reader = vtkXMLPolyDataReader.newInstance();
    const textEncoder = new TextEncoder();
    await reader.parseAsArrayBuffer(
      textEncoder.encode(value.binary_light_viewable)
    );
    const polydata = reader.getOutputData(0);
    const mapper = vtkMapper.newInstance();
    mapper.setInputData(polydata);
    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    const renderer = genericRenderWindow.value.getRenderer();
    const renderWindow = genericRenderWindow.value.getRenderWindow();

    renderer.addActor(actor);
    renderer.resetCamera();
    renderWindow.render();

    db[id] = { actor, polydata, mapper };
  }
  function syncRemoteCamera() {
    const renderer = genericRenderWindow.value.getRenderer();
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

  function remoteRender() {
    viewer_call({
      schema: viewer_schemas.opengeodeweb_viewer.viewer.render_now,
    });
  }

  function setContainer(container) {
    genericRenderWindow.value.setContainer(container.value.$el);
    const webGLRenderWindow =
      genericRenderWindow.value.getApiSpecificRenderWindow();
    webGLRenderWindow.setUseBackgroundImage(true);
    const imageStyle = webGLRenderWindow.getReferenceByName("bgImage").style;

    imageStyle.transition = "opacity 0.1s ease-in";
    imageStyle.zIndex = 1;
    resize(container.value.$el.offsetWidth, container.value.$el.offsetHeight);
    useMousePressed({
      target: container,
      onPressed: (event) => {
        if (event.button == 0) {
          // left click
          is_moving.value = true;
          event.stopPropagation(); // Prevents toggle for menu click
          imageStyle.opacity = 0;
        }
      },
      onReleased: () => {
        is_moving.value = false;
        syncRemoteCamera();
      },
    });
    let wheelEventEndTimeout = null;
    useEventListener(container, "wheel", () => {
      is_moving.value = true;
      imageStyle.opacity = 0;

      clearTimeout(wheelEventEndTimeout);
      wheelEventEndTimeout = setTimeout(() => {
        is_moving.value = false;
        syncRemoteCamera();
      }, 600);
    });
  }

  async function resize(width, height) {
    if (
      viewer_store.status != Status.CONNECTED ||
      status.value != Status.CREATED
    ) {
      return;
    }
    const webGLRenderWindow =
      genericRenderWindow.value.getApiSpecificRenderWindow();
    const canvas = webGLRenderWindow.getCanvas();

    canvas.width = width;
    canvas.height = height;

    await nextTick();
    webGLRenderWindow.setSize(width, height);
    viewStream.setSize(width, height);
    const renderWindow = genericRenderWindow.value.getRenderWindow();
    renderWindow.render();
    remoteRender();
  }

  return {
    db,
    genericRenderWindow,
    addItem,
    syncRemoteCamera,
    initHybridViewer,
    resize,
    setContainer,
  };
});
