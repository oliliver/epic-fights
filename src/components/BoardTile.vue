<template>
  <div class="group relative" :class="[
    getBackgroundColor(tile.id)
  ]" :key="tile.id">
    <div v-if="!tile.isCornerTile" class="flex flex-col h-full w-full">
      <FighterPawn v-if="fighterOnThisTile" :fighter="fighterOnThisTile" :tile="tile" class="relative z-10" />
      <div v-else-if="store.selectedPawnId && tileIsInRange && tileIsAccessable" @click="movePawn"
        class="absolute inset-0 flex transition-opacity bg-emerald-200 cursor-pointer">
        <div class="h-1/2 w-1/2 m-auto opacity-0 group-hover:opacity-100 rounded-full bg-emerald-300" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FighterPawn from "../components/FighterPawn.vue";
import Tile from '../models/Tile';
import Fighter from '../models/Fighter';
import constants from "../constants";
import { storeToRefs } from 'pinia';
import { useStore } from '../store';
import { computed } from "vue";

const props = defineProps<{ tile: Tile }>()

const store = useStore()

const { fightersOnTiles, players } = storeToRefs(store)

const fighterOnThisTile = computed(() => {
  return fightersOnTiles.value[props.tile.id] as Fighter
})

function getBackgroundColor(index: number) {
  if (props.tile.isCornerTile) return 'bg-transparent'

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

const tileIsAccessable = computed(() => {
  const selectedFighter = store.selectedPawn?.fighter

  return !props.tile.isOccupied() && (!props.tile.isEdgeTile || props.tile.id == selectedFighter?.startingTile.id)
})

function movePawn() {
  store.movePawn(props.tile)
}
</script>