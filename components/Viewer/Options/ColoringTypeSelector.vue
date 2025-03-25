<template>
  <v-row justify="center" align="center">
    <v-divider />

    <v-col>
      <v-row justify="center" align="center">
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
            label="Select a coloring style"
            density="compact"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col cols="10">
          <template v-if="coloring_style_key === color_dict['value']">
            <ViewerOptionsColorPicker v-model="color" />
          </template>
          <template v-if="coloring_style_key === textures_dict['value']">
            <ViewerOptionsTexturesSelector v-model="textures" :id="id" />
          </template>
          <template v-if="coloring_style_key === vertex_dict['value']">
            <ViewerOptionsVertexAttributeSelector
              v-model="vertex_attribute"
              :id="id"
            />
          </template>
          <!-- <template v-if="coloring_style_key === edge_dict['value']">
            <ViewerOptionsEdgeAttributeSelector v-model="edge_attribute" :id="id" />
          </template> -->
          <template v-if="coloring_style_key === polygon_dict['value']">
            <ViewerOptionsPolygonAttributeSelector
              v-model="polygon_attribute"
              :id="id"
            />
          </template>
          <template v-if="coloring_style_key === polyhedron_dict['value']">
            <ViewerOptionsPolyhedronAttributeSelector
              v-model="polyhedron_attribute"
              :id="id"
            />
          </template>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
const coloring_style_key = defineModel("coloring_style_key");

const color = defineModel("color");
const textures = defineModel("textures");
const vertex_attribute = defineModel("vertex_attribute");
// const edge_attribute = defineModel("edge_attribute");
const polygon_attribute = defineModel("polygon_attribute");
const polyhedron_attribute = defineModel("polyhedron_attribute");

const props = defineProps({
  id: { type: String, required: true },
});

const has_color = computed(() => (color.value !== undefined ? true : false));
const has_textures = computed(() =>
  textures.value !== undefined ? true : false
);
const has_vertex = computed(() =>
  vertex_attribute.value !== undefined ? true : false
);
const has_polygons = computed(() =>
  polygon_attribute.value !== undefined ? true : false
);
const has_polyhedra = computed(() =>
  polyhedron_attribute.value !== undefined ? true : false
);

const color_dict = { name: "Color", value: "color" };
const textures_dict = { name: "Textures", value: "textures" };
const vertex_dict = { name: "Vertex attribute", value: "vertex" };
// const edge_dict = { name: "Edge attribute", value: "edge" };
const polygon_dict = { name: "Polygon attribute", value: "polygon" };
const polyhedron_dict = {
  name: "Polyhedron attribute",
  value: "polyhedron",
};
const coloring_styles = computed(() => {
  let array = [];
  if (has_color.value) array.push(color_dict);
  if (has_textures.value) array.push(textures_dict);
  if (has_vertex.value) array.push(vertex_dict);
  // if (has_edges.value) array.push(edge_dict);
  if (has_polygons.value) array.push(polygon_dict);
  if (has_polyhedra.value) array.push(polyhedron_dict);

  const labels = array.map((coloring) => {
    return coloring.name;
  });
  const values = array.map((coloring) => {
    return coloring.value;
  });

  return { labels, values };
});

const coloring_style_label = ref(
  coloring_styles.value.labels[
    coloring_styles.value.values.indexOf(coloring_style_key.value)
  ]
);

watch(coloring_style_label, (value) => {
  coloring_style_key.value =
    coloring_styles.value.values[coloring_styles.value.labels.indexOf(value)];
});
</script>
