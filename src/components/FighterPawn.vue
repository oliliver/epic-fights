<template>
  <div class="h-full w-full relative flex select-none">
    <div v-if="tile.isWithinAttackRange() && tile.isEnemy()"
      class="absolute p-3 opacity-0 hover:opacity-90 bg-opacity-50 transition-opacity cursor-crosshair bg-black"
      @click="attack">
      <img src="../assets/icons/sword.svg" style="filter: invert(1);" />
    </div>
    <div
      class="rounded-full h-3/5 w-3/5 m-auto flex flex-col items-center justify-center shadow-md border-2 sm:border-4 cursor-pointer"
      :class="[constants.colors.border[fighter.player.color], isSelected ? 'bg-gray-100' : 'bg-gray-200']"
      :style="{ boxShadow: isSelected ? constants.colors.highlight[fighter.player.color] : '' }" @click="selectPawn">
      <strong class="text-xs text-clamp-xs leading-none sm:leading-snug md:leading-tight">
        {{ fighter.tier }}
      </strong>
      <transition name="fade-out-background" mode="out-in">
        <strong class="text-red-500 text-clamp-sm leading-none whitespace-nowrap">
          <span>{{ fighter.healthPoints }}</span>
          <span v-if="fighter.healthPoints < fighter.healthPointsMax" class="text-clamp-xs"> /
            {{ fighter.healthPointsMax }}</span>
        </strong>
      </transition>
    </div>
  </div>
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

function attack() {
  store.attackPawn(props.fighter)
}

const isSelected = computed(() => store.selectedPawnId == props.fighter.id)
</script>
