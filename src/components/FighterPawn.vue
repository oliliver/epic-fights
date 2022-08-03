<template>
  <div class="h-full w-full relative flex select-none">
    <FighterToken @click="selectPawn" :fighter="fighter" :is-selected="isSelected" />

    <div v-if="isSelected && isActive && boardStore.selectedPawn?.fighter && boardStore.showAbilityOverlay"
      class="absolute inset-0 p-3 z-20">
      <AbilityOverlayItem :ability="boardStore.selectedPawn?.fighter.currentAbility" />
    </div>

    <div v-if="isSelected && isActive" @click="boardStore.showAbilityOverlay = !boardStore.showAbilityOverlay"
      class="cursor-pointer absolute top-1 right-1 h-6 w-6 rounded-full grid place-items-center shadow z-30"
      :style="{ backgroundColor: fighter.player.colorValue() }">
      <p class="hover:opacity-80 leading-none font-bold text-white -translate-y-[6px] text-clamp-xs">...</p>
    </div>

    <div v-if="tile.isWithinAttackRange() && tile.isEnemy()"
      class="absolute p-3 opacity-0 hover:opacity-90 bg-opacity-50 transition-opacity cursor-pointer bg-black"
      @click="attack">
      <img src="../assets/icons/sword.svg" style="filter: invert(1);" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AbilityOverlayItem from './AbilityOverlayItem.vue';
import Fighter from '../models/Fighter';
import FighterToken from './FighterToken.vue';
import { computed } from 'vue';
import { useBoardStore } from "../store";

const props = defineProps<{
  fighter: Fighter
}>()

const boardStore = useBoardStore()

function selectPawn() {
  if (boardStore.selectedPawnId == props.fighter.id) {
    boardStore.deselectPawn()
  } else {
    boardStore.selectPawn(props.fighter)
  }
}

function attack() {
  boardStore.attackPawn(props.fighter)
}

const isSelected = computed(() => boardStore.selectedPawnId == props.fighter.id)
const isActive = computed(() => boardStore.selectedPawn?.player.isActive())
const tile = computed(() => props.fighter.currentTile)
</script>
