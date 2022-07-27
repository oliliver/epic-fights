<template>
  <div class="menu-body">
    <h1 class="font-bold pb-2">Game Menu</h1>
    <button class="menu-btn" @click="showNewGameMenu">New Game</button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../../store";

const store = useStore()

const showNewGameMenu = () => store.setActiveMenu('NEW_GAME')
</script>
