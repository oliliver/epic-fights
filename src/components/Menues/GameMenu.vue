<template>
  <div class="grid place-items-center bg-black bg-opacity-40 overflow-y-auto pt-[5vh] pb-[20vh]" @click="hideMenu">
    <MainMenu v-if="store.activeMenu == 'MAIN_MENU'" />
    <NewGameMenu v-if="store.activeMenu == 'NEW_GAME'" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../../store";
import MainMenu from "./MainMenu.vue";
import NewGameMenu from "./NewGameMenu.vue";

const store = useStore()

function hideMenu(e: MouseEvent) {
  if (e.target !== e.currentTarget) return

  store.setActiveMenu(null)
}
</script>

<style>
.menu-btn {
  @apply border border-gray-500 rounded bg-white;
}

.menu-btn:hover {
  @apply bg-gray-100;
}
</style>