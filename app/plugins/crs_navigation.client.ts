import { useCrsStore } from "@ogw_front/stores/crs";

// The viewer hosts the CRS dialog and the alignment panel, the Data Manager hosts the dialog only.
// A request made on another page (e.g. from a snackbar or the Data Manager PiP) goes to the viewer
export default defineNuxtPlugin(() => {
  const crsStore = useCrsStore();
  const router = useRouter();

  function goToViewerFrom(hostPaths: string[]): void {
    if (!hostPaths.includes(router.currentRoute.value.path)) {
      void router.push("/");
    }
  }

  watch(
    () => crsStore.crsEditRequest,
    (dataId) => {
      if (dataId !== undefined) {
        goToViewerFrom(["/", "/data_manager"]);
      }
    },
  );

  watch(
    () => crsStore.showCrsAlign,
    (show) => {
      if (show) {
        goToViewerFrom(["/"]);
      }
    },
  );
});
