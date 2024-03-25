<template>
  <v-navigation-drawer
    app
    permanent
    mini-variant
    width="100"
    color="transparent"
    style="border: none"
  >
    <v-list>
      <v-list-item link @click="goBack" active-class="">
        <v-list-item-icon>
          <v-icon
            class="back-button icon-border pa-8 mb-8"
            color="white"
            size="40"
          >
            mdi-arrow-left
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item v-for="item in items" :key="item.title" link active-class="">
        <v-list-item-icon>
          <v-icon class="icon-border mb-3 pa-8" color="white" size="40">{{
            item.icon
          }}</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { icon: "mdi-home" },
        { icon: "mdi-plus" },
        { icon: "mdi-folder-outline" },
        { icon: "mdi-layers" },
        { icon: "mdi-upload" },
        { icon: "mdi-puzzle" },
        { icon: "mdi-cog" },
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.back-button {
  margin-top: 30px;
  margin-bottom: 20px;
}

.icon-border {
  border-radius: 18px;
  background-color: #ffffff26;
}
</style>
