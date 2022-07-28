<template>
  <BaseMenu class="w-64" heading="Game Menu" :menu-name="MenuName.MAIN_MENU">
    <button class="menu-btn" @click="store.setActiveMenu(MenuName.NEW_GAME)">New Game</button>
    <button class="menu-btn" @click="store.setActiveMenu(MenuName.SETTINGS)">Settings</button>
  </BaseMenu>
</template>

<script setup lang="ts">
import { useStore } from "../../store";
import { MenuName } from "../../store/types";
import BaseMenu from "./BaseMenu.vue";

const store = useStore()
</script>
