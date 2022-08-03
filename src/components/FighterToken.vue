<template>
  <div
    class="text-gray-900 rounded-full h-3/5 w-3/5 m-auto flex flex-col items-center justify-evenly shadow-md border-2 sm:border-4 cursor-pointer"
    :class="isSelected ? 'bg-gray-100' : 'bg-gray-200'"
    :style="{ borderColor: fighter.player.colorValue(), boxShadow: isSelected ? constants.BOX_SHADOWS[fighter.player.color].highlight : '' }">
    <strong class="text-xs text-clamp-xs leading-none sm:leading-snug md:leading-tight">
      {{ fighter.tier }}
    </strong>
    <strong
      class="min-w-[1.25rem] text-center text-clamp-sm bg-gray-700 px-[3px] py-[2px] leading-none whitespace-nowrap rounded-full"
      :style="{ color: healthColor }">
      {{ fighter.healthPoints }}
    </strong>
  </div>
</template>

<script setup lang="ts">
import constants from '../constants';
import Fighter from '../models/Fighter';
import { computed } from '@vue/reactivity';

const props = defineProps<{
  fighter: Fighter
  isSelected?: boolean,
}>()

const healthColor = computed(() => {
  const { healthPoints, healthPointsMax } = props.fighter

  if (healthPoints == healthPointsMax) return '#0f0'

  const healthPercentage = (healthPoints / healthPointsMax) * 100

  if (healthPoints < healthPointsMax && healthPercentage > 50) return '#ff0'

  if (healthPercentage > 10) return '#fa0'

  return '#f00'
})
</script>