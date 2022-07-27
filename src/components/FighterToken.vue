<template>
  <div
    class="rounded-full h-3/5 w-3/5 m-auto flex flex-col items-center justify-center shadow-md border-2 sm:border-4 bg-gray-200"
    :style="{
      backgroundColor: fighter.player.colorValue()
    }">
    <strong class="text-xs text-clamp-xs leading-none sm:leading-snug md:leading-tight">
      {{ fighter.tier }}
    </strong>
    <strong class="text-red-500 text-clamp-sm leading-none whitespace-nowrap">
      <span>{{ fighter.healthPointsMax }}</span>
    </strong>
  </div>
</template>

<script setup lang="ts">
import Fighter from '../models/Fighter';

const props = defineProps<{
  fighter: Fighter
}>()

</script>