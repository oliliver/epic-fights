<template>
  <button class="rounded-full h-1/2 w-1/2 m-auto flex flex-col items-center justify-center cursor-pointer"
    :class="store.selectedPawnId == fighter.id ? 'bg-green-400' : 'bg-gray-100'" @click="selectPawn">
    <strong>
      {{ fighter.tier }}
    </strong>
    <strong class="text-red-500">
      {{ fighter.healthPoints }}
    </strong>
  </button>
</template>

<script setup lang="ts">
import Fighter from '../models/Fighter';
import Tile from '../models/Tile';
import { useStore } from "../store";

const props = defineProps<{
  fighter: Fighter
  tile: Tile
}>()

const store = useStore()

function selectPawn() {
  store.selectPawn(props.fighter, props.tile)
}
</script>