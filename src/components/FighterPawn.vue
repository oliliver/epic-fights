<template>
  <button
    class="rounded-full h-3/5 w-3/5 m-auto flex flex-col items-center justify-center cursor-pointer shadow-md border-4"
    :class="[constants.colors.border[fighter.player.color], isSelected ? 'bg-gray-100' : 'bg-gray-200']"
    :style="{ boxShadow: isSelected ? constants.colors.highlight[fighter.player.color] : '' }" @click="selectPawn">
    <strong>
      {{ fighter.tier }}
    </strong>
    <strong class="text-red-500">
      {{ fighter.healthPoints }}
    </strong>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

const isSelected = computed(() => store.selectedPawnId == props.fighter.id)
</script>