export default function useDataStyleState() {
  const styles = reactive({});

  const objectVisibility = computed((id) => this.styles[id].visibility);
  const selectedObjects = computed(() => {
    var selection = [];
    for (const [id, value] of Object.entries(this.styles)) {
      if (value.visibility == true) {
        selection.push(id);
      }
    }
    return selection;
  });
  return { styles, objectVisibility, selectedObjects };
}
