import { reactive, computed } from "vue";

export default function useDataStyleState() {
  const styles = reactive({});

  const objectVisibility = computed(() => (id) => styles[id]?.visibility);
  const selectedObjects = computed(() => {
    const selection = [];
    for (const [id, value] of Object.entries(styles)) {
      if (value.visibility === true) {
        selection.push(id);
      }
    }
    return selection;
  });

  return { styles, objectVisibility, selectedObjects };
}
