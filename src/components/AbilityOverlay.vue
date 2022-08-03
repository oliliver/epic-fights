<template>
  <transition-group name="fade" mode="out-in">
    <div v-if="selectedTile && boardStore.showAbilityOverlay" v-for="(ability, i) in abilities" class="absolute z-50"
      :style="{
        top: `calc(${getVector(i, abilities.length).y}px - 4px + ${gridSizes.gridPadding} + (${selectedTile.row - 1} * ${tileSize}) - (${selectedTile.row - 1} * (1px + ${gridSizes.gridGap})) + ${tileSize} / 2)`,
        left: `calc(${getVector(i, abilities.length).x}px - 4px  + ${gridSizes.gridPadding} + (${selectedTile.col - 1} * ${tileSize}) - (${selectedTile.col - 1} * (1px + ${gridSizes.gridGap})) + ${tileSize} / 2)`,
        transformOrigin: '0 0',
        transform: 'translate(calc(-1 * 50%), calc(-1 * 50%))',
        height: `calc(${tileSize} / 2)`,
        width: `calc(${tileSize} / 2)`,
      }" :key="ability.id">
      <AbilityOverlayItem :ability="ability" @click="gameStore.selectFighterAbility(ability)" />
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import constants from '../constants';
import Tile from '../models/Tile';
import { Passivity } from '../models/types';
import { useBoardStore, useGameStore } from '../store';
import AbilityOverlayItem from './AbilityOverlayItem.vue';

const boardStore = useBoardStore()

const props = defineProps<{
  gridSizes: {
    gridSize: string,
    gridGap: string,
    gridPadding: string,
  },
  selectedTile?: Tile
}>()

const gameStore = useGameStore()

const tileSize = computed(() => `${parseInt(props.gridSizes.gridSize) / constants.GRID_HEIGHT}px`)

const abilities = computed(() => {
  return boardStore.selectedPawn?.fighter.abilities.filter(a => a.passivity == Passivity.ACTIVE).map(({ id, icon }) => ({ id, icon })) ?? []
})

const distanceInPixels = computed(() => parseInt(tileSize.value) * .75)

const getDeg = (index: number, total: number) => {
  const direction = index < Math.floor(total / 2) ? -1 : 1
  const distanceToMiddle = Math.abs(index - Math.floor(total / 2))
  const baseDeg = 45

  return direction * (distanceToMiddle * baseDeg + (direction * (total % 2 == 0 ? baseDeg / 2 : 0)))
}

const getVector = (index: number, total: number) => {
  const deg = getDeg(index, total)
  const radians = (Math.PI / 180) * deg
  const vector = {
    x: -distanceInPixels.value * Math.sin(radians),
    y: -distanceInPixels.value * Math.cos(radians),
  }

  return vector
}
</script>