<template>
  <v-navigation-drawer
    app
    permanent
    mini-variant
    width="70"
    color="transparent"
    style="border: none"
  >
    <v-list>
      <v-list-item link @click="goBack" active-class="">
        <v-list-item-icon>
          <v-icon
            class="back-button icon-border pa-5 mb-4"
            color="white"
            size="25"
          >
            mdi-arrow-left
          </v-icon>
        </v-list-item-icon>
      </v-list-item>

      <v-list-item v-for="item in items" :key="item.title" link active-class="">
        <v-list-item-icon>
          <v-icon class="icon-border my-1 pa-5" color="white" size="25">{{
            item.icon
          }}</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const items = [
  { icon: "mdi-home" },
  { icon: "mdi-plus" },
  { icon: "mdi-folder-outline" },
  { icon: "mdi-layers" },
  { icon: "mdi-upload" },
  { icon: "mdi-puzzle" },
  { icon: "mdi-cog" },
];
function goBack() {
  this.$router.go(-1);
}
</script>

<style scoped>
.back-button {
  margin-top: 30px;
  margin-bottom: 20px;
}

.icon-border {
  border-radius: 20%;
  background-color: #ffffff26;
}
</style>
