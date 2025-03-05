<template>
  <v-row align="center" justify="center">
    <v-divider />
    <v-col cols="auto">
      <v-icon
        size="30"
        icon="mdi-format-color-fill"
        v-tooltip:left="'Coloring'"
      />
    </v-col>
    <v-col>
      <v-select
        v-model="coloring_style_label"
        :items="coloring_styles.labels"
        width="200"
        label="Select a color style"
        density="compact"
      />
    </v-col>
  </v-row>
  <v-row align="center">
    <v-col>
      <template v-if="coloring_style_key === color_dict['value']">
        <ViewerOptionsConstantColorPicker v-model="coloring_value" />
      </template>
      <template v-if="coloring_style === textures_dict['value']">
        <ViewerOptionsTexturesSelector
          v-model="props.coloring_value"
          :id="id"
        />
      </template>
      <template v-if="coloring_style === vertex_dict['value']">
        <ViewerOptionsVertexAttributeSelector
          v-model="props.coloring_value"
          :id="id"
        />
      </template>
      <template v-if="coloring_style === edge_dict['value']">
        <ViewerOptionsEdgeAttributeSelector
          v-model="props.coloring_value"
          :id="id"
        />
      </template>
      <template v-if="coloring_style === polygon_dict['value']">
        <ViewerOptionsPolygonAttributeSelector
          v-model="props.coloring_value"
          :id="id"
        />
      </template>
      <template v-if="coloring_style === polyhedron_dict['value']">
        <ViewerOptionsPolyhedronAttributeSelector
          v-model="props.coloring_value"
          :id="id"
        />
      </template>
    </v-col>
  </v-row>
</template>

<script setup>
const coloring_style_key = defineModel("coloring_style_key");
const coloring_style_label = ref("");
const coloring_value = defineModel("coloring_value");

const props = defineProps({
  id: { type: String, required: true },
  bool_color: { type: Boolean, required: false, default: false },
  bool_textures: { type: Boolean, required: false, default: false },
  bool_vertex: { type: Boolean, required: false, default: false },
  bool_edges: { type: Boolean, required: false, default: false },
  bool_polygons: { type: Boolean, required: false, default: false },
  bool_polyhedrons: { type: Boolean, required: false, default: false },
});

const color_dict = { name: "Color", value: "color" };
const textures_dict = { name: "Textures", value: "textures" };
const vertex_dict = { name: "From vertex attribute", value: "points" };
const edge_dict = { name: "From edge attribute", value: "edges" };
const polygon_dict = { name: "From polygon attribute", value: "polygons" };
const polyhedron_dict = {
  name: "From polyhedron attribute",
  value: "polyhedrons",
};
const coloring_styles = computed(() => {
  let array = [];
  if (props.bool_color) array.push(color_dict);
  if (props.bool_texture) array.push(textures_dict);
  if (props.bool_vertex) array.push(vertex_dict);
  if (props.bool_edges) array.push(edge_dict);
  if (props.bool_polygons) array.push(polygon_dict);
  if (props.bool_polyhedrons) array.push(polyhedron_dict);

  const labels = array.map((coloring) => {
    return coloring.name;
  });
  const values = array.map((coloring) => {
    return coloring.value;
  });

  return { labels, values };
});
console.log("coloring_styles", coloring_styles);

watch(coloring_style_label, (value) => {
  coloring_style_key.value =
    coloring_styles.value.values[coloring_styles.value.labels.indexOf(value)];
  console.log("coloring_style_key", coloring_style_key.value);
});
</script>
