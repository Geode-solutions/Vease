<template>
  <v-app-bar flat color="transparent" height="120" :elevation="0">
    <div class="v-toolbar__content justify-center align-center">
      <v-img
        src="/assets/img/logo.png"
        max-height="70"
        max-width="70"
        class="ml-3 mr-0"
        contain
      ></v-img>
      <h1 class="couleur title-text ml-4">Vease</h1>
      <v-spacer></v-spacer>
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        hide-details
        label="Search"
        class="couleur mr-3"
        v-model="search"
        single-line
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon class="mr-6">
          <v-icon class="couleur icon-border pa-8" size="36"
            >mdi-account</v-icon
          >
        </v-btn>
      </v-toolbar-items>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      search: "",
    };
  },
};
</script>

<style>
.couleur {
  color: white;
}
.icon-border {
  border-radius: 18px;
  background-color: #ffffff26;
}

.title-text {
  font-size: 50px;
  font-weight: 100;
}
</style>
