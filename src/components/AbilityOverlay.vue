<template>
  <transition-group name="fade" mode="out-in">
    <div v-if="selectedTile && boardStore.showAbilityOverlay" v-for="(ability, i) in abilities"
      :class="ability.abilityTypes.some(t => t === AbilityType.ATTACK_REPLACEMENT) && 'peer'" class="absolute z-50"
      :style="{
        top: `calc(${getVector(i, abilities.length).y}px - 4px + ${gridSizes.gridPadding} + (${selectedTile.row - 1} * ${tileSize}) - (${selectedTile.row - 1} * (1px + ${gridSizes.gridGap})) + ${tileSize} / 2)`,
        left: `calc(${getVector(i, abilities.length).x}px - 4px  + ${gridSizes.gridPadding} + (${selectedTile.col - 1} * ${tileSize}) - (${selectedTile.col - 1} * (1px + ${gridSizes.gridGap})) + ${tileSize} / 2)`,
        transform: 'translate(calc(-1 * 50%), calc(-1 * 50%))',
        height: `calc(${tileSize} / 2)`,
        width: `calc(${tileSize} / 2)`,
      }" :key="ability.id">
      <AbilityOverlayItem :ability="ability" @click="gameStore.selectFighterAbility(ability)" />
    </div>

    <!-- NOTE: this element has a peer-* class an must therefore be placed *after* its peer -->
    <div v-if="selectedTile && boardStore.showAbilityOverlay && selectedFighter?.hasAttackReplacements()"
      class="absolute hidden bg-black bg-opacity-20 rounded-full peer-hover:grid place-items-center fill-current text-white z-20"
      :style="{
        top: `calc(0px - .25rem + ${gridSizes.gridPadding} + (${selectedTile.row - 1} * ${tileSize}) - (${selectedTile.row - 1} * (1px + ${gridSizes.gridGap})) + ${tileSize} / 2)`,
        left: `calc(0px - .25rem  + ${gridSizes.gridPadding} + (${selectedTile.col - 1} * ${tileSize}) - (${selectedTile.col - 1} * (1px + ${gridSizes.gridGap})) + ${tileSize} / 2)`,
        transform: 'translate(calc(-1 * 50%), calc(-1 * 50%))',
        height: `calc(${tileSize} * (3 / 6))`,
        width: `calc(${tileSize} * (3 / 6))`,
        padding: `calc(${tileSize} / 9)`,
      }" key="1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M14.2929 2.29289C14.6834 1.90237 15.3166 1.90237 15.7071 2.29289L19.7071 6.29289C20.0976 6.68342 20.0976 7.31658 19.7071 7.70711L15.7071 11.7071C15.3166 12.0976 14.6834 12.0976 14.2929 11.7071C13.9024 11.3166 13.9024 10.6834 14.2929 10.2929L16.5858 8L5 8C4.44772 8 4 7.55228 4 7C4 6.44771 4.44772 6 5 6L16.5858 6L14.2929 3.70711C13.9024 3.31658 13.9024 2.68342 14.2929 2.29289ZM9.70711 12.2929C10.0976 12.6834 10.0976 13.3166 9.70711 13.7071L7.41421 16H19C19.5523 16 20 16.4477 20 17C20 17.5523 19.5523 18 19 18H7.41421L9.70711 20.2929C10.0976 20.6834 10.0976 21.3166 9.70711 21.7071C9.31658 22.0976 8.68342 22.0976 8.29289 21.7071L4.29289 17.7071C4.10536 17.5196 4 17.2652 4 17C4 16.7348 4.10536 16.4804 4.29289 16.2929L8.29289 12.2929C8.68342 11.9024 9.31658 11.9024 9.70711 12.2929Z" />
      </svg>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import AbilityOverlayItem from './AbilityOverlayItem.vue';
import constants from '../constants';
import { computed } from '@vue/reactivity';
import { AbilityType, Passivity, TTile } from '../models/types';
import { useBoardStore, useGameStore } from '../store';

const boardStore = useBoardStore()

const props = defineProps<{
  gridSizes: {
    gridSize: string,
    gridGap: string,
    gridPadding: string,
  },
  selectedTile?: TTile
}>()

const gameStore = useGameStore()

const selectedFighter = computed(() => boardStore.selectedPawn?.fighter)

const tileSize = computed(() => `${parseInt(props.gridSizes.gridSize) / constants.GRID_HEIGHT}px`)

const abilities = computed(() => {
  return selectedFighter.value?.abilities
    .filter(a =>
      a.passivity == Passivity.ACTIVE &&
      a.id !== selectedFighter.value?.currentAbility?.id
    )
    .sort((a, b) => a.indexOnFighter - b.indexOnFighter) ?? []
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