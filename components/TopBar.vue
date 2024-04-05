<template>
  <v-app-bar flat color="transparent" class="ma-1" height="60" :elevation="0">
    <v-row class="pa-1 ma-1 align-center">
      <v-img
        :src="logo"
        max-height="40"
        max-width="40"
        class="ml-3 mr-0"
        contain
      />
      <h2 style="color: white" class="ml-2 title-text">Vease</h2>
      <v-spacer />
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        hide-details
        label="Search"
        style="color: white"
        class="mt-1"
        v-model="search"
        single-line
      ></v-text-field>
      <v-spacer />
      <v-tooltip text="Account">
        <template v-slot:activator="{ props }">
          <v-btn
            v-for="(link, i) in links"
            :key="i"
            v-bind="props"
            class="ml-2 mr-8"
            style="border-radius: 20%"
            flat
            icon
            :to="link.to"
          >
            <v-icon
              v-if="!userImage"
              class="icon-style pa-6"
              icon="mdi-account"
              color="white"
              size="40"
            />
            <v-avatar v-else size="40">
              <v-img :src="URL.createObjectURL(userImage)" />
            </v-avatar>
          </v-btn>
        </template>
      </v-tooltip>
    </v-row>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/src/userStore.js";
import logo from "@/assets/img/logo.png";

const search = ref("");
const links = [{ title: "Account", to: "/account" }];

const userStore = useUserStore();
const userImage = computed(() => userStore.userImage);
</script>
