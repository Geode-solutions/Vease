<template>
  <ViewerContextualMenuItem v-bind="$attrs">
    <template #tooltip> points color </template>

    <template #btn="{ btnStyle }">
      <LogoPointsColor
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>
    <template #option>
      <v-card>
        <v-card-text class="justify-center">
          <v-switch v-model="visibility" label="Visibility" />
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
  </ViewerContextualMenuItem>
</template>

<script setup>
import back_schemas from "@geode/opengeodeweb-back/schemas.json";

// Props
const props = defineProps({
  item: { type: Object, required: true },
});

// Stores
const dataStyleStore = useDataStyleStore();

// Variables
const visibility = ref(true);
const color = reactive({ r: 0, g: 0, b: 0 });
const select = "";
const styles = ["Constant", "From vertex attribute", "From polygon attribute"];
const vertexAttributeName = ref("");
const polygonAttributeName = ref("");
const vertexAttributes = ref([]);
const polygonAttributes = ref([]);

onMounted(() => {
  getAttributeNames();
});

async function getAttributeNames() {
  await api_fetch(
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
  );
  api_fetch(
    {
      schema: back_schemas.opengeodeweb_back.polygon_attribute_names,
      params: {
        input_geode_object: props.item.geode_object,
        filename: props.item.filename,
      },
    },
    {
      response_function: (response) => {
        polygonAttributes.value = response._data.polygon_attribute_names;
      },
    }
  );
}

watch(visibility, (value) => {
  data_style_store.setMeshPointsVisibility({ id: props.item.id, value });
});

watch(select, (value) => {
  // this.$store.commit("setObjectStyle", {
  //   id: this.item.id,
  //   style: ["color", "type"],
  //   value,
  // });
});

watch(color, (value) => {
  dataStyleStore.setMeshPointsColor({ id: props.item.id, color: value });
});

watch(vertexAttributeName, (value) => {
  if (!value) return;
  // this.$store.dispatch("mesh/style/setAttributeColor", {
  //   id: this.item.id,
  //   attribute: value,
  //   location: "vertex",
  // });
});

watch(polygonAttributeName, (value) => {
  if (!value) return;
  // this.$store.dispatch("mesh/style/setAttributeColor", {
  //   id: this.item.id,
  //   attribute: value,
  //   location: "polygon",
  // });
});

onMounted(() => {
  select.value = this.item.style.color.type;
  vertexAttributeName.value = this.item.style.color.vertexAttributeName;
  polygonAttributeName.value = this.item.style.color.polygonAttributeName;
  const color = this.item.style.color.value;
  color = {
    r: color[0] * 255,
    g: color[1] * 255,
    b: color[2] * 255,
  };
});
</script>
