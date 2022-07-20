<template>
  <div class="flex flex-col group relative" :class="[
    tile.isCornerTile && 'opacity-0',
    getBackgroundColor(tile.id)
  ]" :key="tile.id">
    <FighterPawn v-if="fightersOnTiles[tile.id]" :fighter="fightersOnTiles[tile.id]" :tile="tile"
      class="relative z-10" />
    <div v-else-if="store.selectedPawnId && tileIsInRange"
      class="absolute inset-0 flex transition-opacity bg-emerald-200 cursor-pointer">
      <div class="h-1/2 w-1/2 m-auto opacity-0 group-hover:opacity-100 rounded-full bg-emerald-300" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FighterPawn from "../components/FighterPawn.vue";
import Tile from '../models/Tile';
import constants from "../constants";
import { storeToRefs } from 'pinia';
import { useStore } from '../store';
import { computed } from "vue";

const props = defineProps<{ tile: Tile }>()

const store = useStore()

const { fightersOnTiles, players } = storeToRefs(store)

function getBackgroundColor(index: number) {
  for (const player of players.value) {
    if (player.tiles.some(tile => tile.id == index)) {
      return `${constants.colors.bg[player.color]} rounded-sm`
    }
  }

  return 'bg-gray-100'
}

const tileIsInRange = computed(() => {
  const selectedTile = store.selectedPawn?.tile

  if (!selectedTile) return false

  return (Math.abs(selectedTile.row - props.tile.row) + Math.abs(selectedTile.col - props.tile.col)) <= (store.selectedPawn?.fighter.movementPoints ?? 0)
})
</script>