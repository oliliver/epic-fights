<template>
  <div @click="movePawn" class="flex transition-opacity bg-emerald-200 cursor-pointer z-20">
    <div class="h-1/2 w-1/2 m-auto opacity-0 group-hover:opacity-100 rounded-full bg-emerald-300" />
  </div>
</template>

<script setup lang="ts">
import Tile from '../models/Tile';
import { useStore } from "../store";

const props = defineProps<{ tile: Tile }>()
const store = useStore()

function movePawn() {
  store.movePawn(props.tile)
}


</script>