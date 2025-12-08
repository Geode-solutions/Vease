<template>
  <v-app-bar flat color="transparent" class="ma-1" height="60" :elevation="0">
    <v-row class="pa-1 ma-1 align-center">
      <v-img
        :src="logo"
        max-height="50"
        max-width="50"
        class="ml-3 mr-0"
        contain
        draggable="false"
      />
      <h2 style="color: white" class="ml-2 mb-1 title-text">Vease</h2>
      <!-- <v-spacer />
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        hide-details
        label="Search"
        style="color: white"
        class="mt-1"
        v-model="search"
        single-line
      ></v-text-field>
      <v-spacer /> -->
      <!-- <v-tooltip>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="ml-2 mr-8"
            style="border-radius: 20%"
            flat
            icon
            to="/account"
          >
            <v-icon
              v-if="!profileImagePath"
              class="icon-style pa-6"
              icon="mdi-account"
              color="white"
              size="40"
            />
            <v-avatar v-else size="50">
              <v-img :src="getProfileImage(profileImagePath)" />
            </v-avatar>
          </v-btn>
        </template>
        <span>Account</span>
      </v-tooltip> -->
    </v-row>
  </v-app-bar>
</template>

<script setup>
  import logo from "@vease/assets/img/logo.png"

  // const search = ref("")
  // const userStore = useUserStore()
  // const { profileImagePath } = storeToRefs(userStore)

  const getProfileImage = (path) => {
    if (path) {
      return URL.createObjectURL(path)
    }
    return ""
  }
</script>
