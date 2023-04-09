<template>
  <div
    class="text-gray-900 relative rounded-full h-3/5 w-3/5 m-auto flex flex-col items-center justify-evenly shadow-md border-2 sm:border-4 cursor-pointer bg-gray-50 bg-opacity-20"
    :style="{
      borderColor: fighter.player.colorValue(),
      boxShadow: isSelected ? constants.BOX_SHADOWS[fighter.player.color].highlight : ''
    }">
    <img class="absolute inset-0 h-full w-full z-0" v-if="imagePath" :src="imagePath" />
    <div class="ml-auto h-[85%] mr-2 flex flex-col items-center justify-end">
      <strong
        class="min-w-[1.25rem] text-center text-clamp-sm bg-gray-700 px-[3px] py-[2px] leading-none whitespace-nowrap rounded-full relative"
        :style="{ color: healthColor }">
        {{ fighter.healthPoints }}
      </strong>
    </div>PRO gyse
  </div>
</template>

<script setup lang="ts">
import constants from '../constants';
import Fighter from '../models/Fighter';
import { computed, ref, watch } from 'vue';

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

const imagePath = ref('')

watch(
  () => props.fighter.fighterId,
  async () => {
    imagePath.value = (await import(`../assets/icons/fighter-${props.fighter.fighterId}.png`)).default || ''
  },
  { immediate: true }
)
</script>