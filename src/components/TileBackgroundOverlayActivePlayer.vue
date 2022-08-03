<template>
  <transition :name="isAttackable ? 'fade' : 'fade-30'" appear>
    <div @click="boardStore.moveSelectedPawn(props.tile)" class="p-2 z-20 bg-gray-200 grid group"
      :class="[isAttackable ? 'opacity-100' : 'opacity-30', selectedPlayerCanMove && 'cursor-pointer']"
      :style="{ transitionDelay: `${(tile.numberOfStepsAway ?? 0) * 50}ms` }" :key="boardStore.selectedPawnId">
      <div v-if="selectedPlayerCanMove"
        class="bg-white h-1/2 w-1/2 m-auto opacity-0 shadow-inner group-hover:opacity-40 rounded-full col-start-1 row-start-1" />
      <div v-if="isAttackable" class="bg-red-700 rounded-lg  h-full w-full col-start-1 row-start-1" />
      <div v-else-if="!tile.isOccupied()" :style="{ backgroundColor: selectedPlayerCanMove ? playerColor : '#777' }"
        class="rounded-lg  h-full w-full col-start-1 row-start-1" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ReachableTile } from '../models/types'
import { PlayerAction } from '../store/types'
import { useBoardStore, useGameStore } from "../store";

const props = defineProps<{ tile: ReachableTile }>()
const boardStore = useBoardStore()
const gameStore = useGameStore()

const selectedPlayer = computed(() => gameStore.players.find(p => p.id == boardStore.selectedPlayerId))

const selectedPlayerCanMove = computed(() => selectedPlayer.value?.canPerformAction(PlayerAction.movement))
const selectedFighterCanAttack = computed(() => !!boardStore.selectedPawn?.fighter.currentAbility.isAvailable())
const isAttackable = computed(() => props.tile.isEnemy() && selectedFighterCanAttack.value && props.tile.isWithinAttackRange())

const playerColor = computed(() => selectedPlayer.value?.colorValue() || '')
</script>
