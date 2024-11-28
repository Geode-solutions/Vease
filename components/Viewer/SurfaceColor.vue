<template>
  <contextual-item v-bind="$attrs">
    <template #tooltip> Color </template>

    <template #btn="{ btnStyle }">
      <LogoSurfaceColor
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>

    <template #option>
      <v-card>
        <v-card-text class="justify-center">
          <v-combobox
            v-model="select"
            :items="styles"
            label="Select color style"
          ></v-combobox>
          <v-color-picker
            v-if="select === 'Constant'"
            ref="action"
            v-model="color"
            flat
            canvas-height="100"
            hide-inputs
            width="200"
          ></v-color-picker>
          <v-combobox
            v-model="vertexAttributeName"
            v-if="select === 'From vertex attribute'"
            :items="vertexAttributes"
            label="Select attribute"
          ></v-combobox>
          <v-combobox
            v-model="polygonAttributeName"
            v-if="select === 'From polygon attribute'"
            :items="polygonAttributes"
            label="Select attribute"
          ></v-combobox>
        </v-card-text>
      </v-card>
    </template>
  </contextual-item>
</template>

<script setup>
import LogoSurfaceColor from "@/assets/viewer_svgs/surface_color.svg";
// import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const color = { r: 0, g: 0, b: 0 };
const select = "";
const styles = ["Constant", "From vertex attribute", "From polygon attribute"];
const vertexAttributeName = ref("");
const polygonAttributeName = ref("");
const vertexAttributes = ref([]);
const polygonAttributes = ref([]);

// const props = defineProps({
//   item: { type: Object, required: true },
// });

onMounted(() => {
  // getAttributeNames();
  console.log(vertexAttributes.value);
  console.log(polygonAttributes.value);
});

function getAttributeNames() {
  api_fetch(
    {
      // schema: back_schemas.opengeodeweb_back.vertex_attribute_names,
      params: {
        // input_geode_object: props.item.geode_object,
        // filename: props.item.filename,
      },
    },
    {
      response_function: (response) => {
        vertexAttributes.value = response._data.vertex_attribute_names;
      },
    }
  );
  api_fetch(
    {
      // schema: back_schemas.opengeodeweb_back.polygon_attribute_names,
      params: {
        // input_geode_object: props.item.geode_object,
        // filename: props.item.filename,
      },
    },
    {
      response_function: (response) => {
        polygonAttributes.value = response._data.polygon_attribute_names;
      },
    }
  );
}
//   },
//   watch: {
//     select: function (value) {
//       this.$store.commit("setObjectStyle", {
//         id: this.item.id,
//         style: ["color", "type"],
//         value,
//       });
//     },
//     color: function (value) {
//       this.$store.dispatch("mesh/style/setColor", {
//         id: this.item.id,
//         color: [value.r / 255, value.g / 255, value.b / 255],
//       });
//     },
//     vertexAttributeName: function (value) {
//       if (!value) return;
//       this.$store.dispatch("mesh/style/setAttributeColor", {
//         id: this.item.id,
//         attribute: value,
//         location: "vertex",
//       });
//     },
//     polygonAttributeName: function (value) {
//       if (!value) return;
//       this.$store.dispatch("mesh/style/setAttributeColor", {
//         id: this.item.id,
//         attribute: value,
//         location: "polygon",
//       });
//     },
//   },
//   mounted() {
//     this.select = this.item.style.color.type;
//     this.vertexAttributeName = this.item.style.color.vertexAttributeName;
//     this.polygonAttributeName = this.item.style.color.polygonAttributeName;
//     const color = this.item.style.color.value;
//     this.color = {
//       r: color[0] * 255,
//       g: color[1] * 255,
//       b: color[2] * 255,
//     };
//   },
// };
</script>
