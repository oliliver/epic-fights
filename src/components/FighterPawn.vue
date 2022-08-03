<template>
  <div class="h-full w-full relative flex select-none">
    <div v-if="isSelected && isActive" @click="boardStore.showAbilityOverlay = !boardStore.showAbilityOverlay"
      class="cursor-pointer absolute top-1 right-1 h-6 w-6 rounded-full grid place-items-center shadow"
      :style="{ backgroundColor: fighter.player.colorValue() }">
      <p class="leading-none font-bold text-white -translate-y-[6px]">...</p>
    </div>
    <div v-if="tile.isWithinAttackRange() && tile.isEnemy()"
      class="absolute p-3 opacity-0 hover:opacity-90 bg-opacity-50 transition-opacity cursor-pointer bg-black"
      @click="attack">
      <img src="../assets/icons/sword.svg" style="filter: invert(1);" />
    </div>
    <div
      class="rounded-full h-3/5 w-3/5 m-auto flex flex-col items-center justify-evenly shadow-md border-2 sm:border-4 cursor-pointer"
      :class="isSelected ? 'bg-gray-100' : 'bg-gray-200'"
      :style="{ borderColor: fighter.player.colorValue(), boxShadow: isSelected ? constants.BOX_SHADOWS[fighter.player.color].highlight : '' }"
      @click="selectPawn">
      <strong class="text-xs text-clamp-xs leading-none sm:leading-snug md:leading-tight">
        {{ fighter.tier }}
      </strong>
      <strong
        class="min-w-[1.25rem] text-center text-clamp-sm bg-gray-700 px-[3px] py-[2px] leading-none whitespace-nowrap rounded-full"
        :style="{ color: healthColor }">
        {{ fighter.healthPoints }}
      </strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import constants from '../constants';
import Fighter from '../models/Fighter';
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

const healthColor = computed(() => {
  const { healthPoints, healthPointsMax } = props.fighter

  if (healthPoints == healthPointsMax) return '#0f0'

  const healthPercentage = (healthPoints / healthPointsMax) * 100

  if (healthPoints < healthPointsMax && healthPercentage > 50) return '#ff0'

  if (healthPercentage > 10) return '#fa0'

  return '#f00'
})
</script>
