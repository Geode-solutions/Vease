<template>
  <v-app-bar flat color="transparent" class="ma-1" height="60" :elevation="0">
    <v-row class="pa-1 ma-1 align-center">
      <v-img
        src="/assets/img/logo.png"
        max-height="40"
        max-width="40"
        class="ml-3 mr-0"
        contain
      />
      <h2 class="couleur ml-2 title-text">Vease</h2>
      <v-spacer />
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        hide-details
        label="Search"
        class="couleur mt-1"
        v-model="search"
        single-line
      ></v-text-field>
      <v-spacer />
      <v-tooltip text="Account">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="icon-style ml-2"
            height="50"
            width="50"
            flat
            icon
          >
            <v-icon
              icon="mdi-account"
              color="white"
              height="50px"
              width="50px"
              size="30"
            />
          </v-btn>
        </template>
      </v-tooltip>
    </v-row>
  </v-app-bar>
</template>

<script setup>
const search = ref("");
</script>

<style scoped>
.couleur {
  color: white;
}
.icon-style {
  border-radius: 20%;
  background-color: #ffffff26;
}

.title-text {
  font-size: 30px;
  font-weight: 100;
}
</style>
