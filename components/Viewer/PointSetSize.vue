<template>
  <contextual-item v-bind="$attrs">
    <template #tooltip> Points size </template>

    <template #btn="{ btnStyle }">
      <logo-points-size
        :style="{ height: btnStyle.height, width: btnStyle.width }"
      />
    </template>

    <template #option>
      <v-card width="200">
        <v-slider
          v-model="size"
          hide-details
          min="0"
          max="20"
          step="2"
          thumb-label
          thumb-color="black"
          ticks
        ></v-slider>
      </v-card>
    </template>
  </contextual-item>
</template>

<script>
import LogoPointsSize from "../../assets/point_set_size.svg";
import ContextualItem from "@geode/geode-tools/src/components/ContextualItem";

export default {
  name: "PointsSize",
  components: {
    ContextualItem,
    LogoPointsSize,
  },
  data: () => ({
    size: 0,
  }),
  props: {
    item: Object,
  },
  watch: {
    size: function (value) {
      this.$store.dispatch("mesh/style/setPointsSize", {
        id: this.item.id,
        value,
      });
    },
  },
  mounted() {
    this.size = this.item.style.size;
  },
};
</script>
