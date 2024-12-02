<template>
  <contextual-item v-bind="$attrs">
    <template #tooltip>Points color</template>

    <template #btn="{ btnStyle }">
      <LogoPointsColor
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
        </v-card-text>
      </v-card>
    </template>
  </contextual-item>
</template>

<script setup>
import LogoPointsColor from "@/assets/viewer_svgs/point_set_color.svg"
// import ContextualItem from "@geode/geode-tools/src/components/ContextualItem"
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

const color = { r: 0, g: 0, b: 0 }
const select = ref("")
const styles = ["Constant", "From vertex attribute"]
const vertexAttributeName = ref("")
const vertexAttributes = ref([])

const props = defineProps({
  item: { type: Object, required: true },
});


onMounted(() => {
  getAttributeNames();
})
    function getAttributeNames() {
      api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.vertex_attribute_names,
      params: {
        input_geode_object: props.item.geode_object,
        filename: props.item.filename,
      },
    },
    {
      response_function: (response) => {
        vertexAttributes.value = response._data.vertex_attribute_names;
      },
    }
  )
    }

//   watch: {
//     select: function (value) {
//       this.$store.commit("setObjectStyle", {
//         id: this.item.id,
//         style: ["color", "type"],
//         value,
//       });
//     },
//     color: function (value) {
//       const newColor = [value.r / 255, value.g / 255, value.b / 255];
//       this.$store.dispatch("mesh/style/setColor", {
//         id: this.item.id,
//         color: newColor,
//       });
//     },
//     vertexAttributeName: function (value) {
//       if (!value) return;
//       this.call({
//         command: "opengeode.attribute.vertex",
//         args: [this.item.id, value],
//       });
//     },
//   },
//   mounted() {
//     this.select = this.item.style.color.type;
//     this.vertexAttributeName = this.item.style.color.vertexAttributeName;
//     const color = this.item.style.color.value;
//     this.color = {
//       r: color[0] * 255,
//       g: color[1] * 255,
//       b: color[2] * 255,
//     };
//   },
// };
</script>
