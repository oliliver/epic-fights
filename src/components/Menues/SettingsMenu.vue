<template>
  <BaseMenu heading="Settings" :menu-name="MenuName.SETTINGS">
    <label for="showSplashScreen" class="flex gap-2 select-none cursor-pointer text-gray-700 hover:text-gray-900">
      <input id="showSplashScreen" type="checkbox" v-model="store.settings.useSplashScreen" />
      <span>Show splashscreen on startup</span>
    </label>
  </BaseMenu>
</template>

<script setup lang="ts">
import { useStore } from "../../store";
import { MenuName } from "../../store/types";
import BaseMenu from "./BaseMenu.vue";

const store = useStore()
</script>