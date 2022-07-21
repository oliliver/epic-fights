<template>
  <button
    class="rounded-full h-3/5 w-3/5 m-auto flex flex-col items-center justify-center cursor-pointer shadow-md border-4"
    :class="store.selectedPawnId == fighter.id ? 'bg-green-400' : 'bg-gray-200', constants.colors.border[fighter.player.color]"
    @click="selectPawn">
    <strong>
      {{ fighter.tier }}
    </strong>
    <strong class="text-red-500">
      {{ fighter.healthPoints }}
    </strong>
  </button>
</template>

<script setup lang="ts">
import constants from '../constants';
import Fighter from '../models/Fighter';
import Tile from '../models/Tile';
import { useStore } from "../store";

const props = defineProps<{
  fighter: Fighter
  tile: Tile
}>()

const store = useStore()

function selectPawn() {
  if (store.selectedPawnId == props.fighter.id) {
    store.deselectPawn()
  } else {
    store.selectPawn(props.fighter, props.tile)
  }
}
</script>