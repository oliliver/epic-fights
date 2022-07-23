
<template>
  <label for="animate"
    class="absolute right-2 top-0 flex gap-2 select-none cursor-pointer text-gray-700 hover:text-gray-900">
    <input id="animate" type="checkbox" v-model="animate" />
    <span>Splashscreen</span>
  </label>
  <Title class="opacity-0 mx-auto" />
  <Title class="absolute left-1/2 -translate-x-1/2 transition-[margin] delay-[1s] duration-[2s]"
    :class="[!isMounted && animate && 'mt-[40vh]']" />
  <div
    class="xl:w-full flex flex-col justify-center pb-4 xl:grid m-auto xl:p-10 h-full gap-4 items-stretch bg-white transition-opacity duration-[.75s] delay-[3s] ease-linear"
    :class="[isMounted || !animate ? 'opacity-100' : 'opacity-0', `w-[${gridSize}]`]" :style="{
      gridTemplateColumns: '1fr min-content 1fr',
      gridTemplateRows: gridSize,
    }">
    <div id="board-grid" class="w-full flex-none col-start-2 grid gap-1 bg-gray-900 p-4 rounded-md mx-auto" :style="{
      gridTemplateColumns: `repeat(${constants.GRID_WIDTH}, 1fr)`,
      gridTemplateRows: `repeat(${constants.GRID_HEIGHT}, 1fr)`,
      height: gridSize,
      width: gridSize
    }">
      <ReachableTileOverlay v-for="tile in store.reachableTiles" :tile="tile"
        :style="{ gridColumnStart: tile.col, gridRowStart: tile.row }" />
      <BoardTile v-for="tile in store.tiles" :tile="tile"
        :style="{ gridColumnStart: tile.col, gridRowStart: tile.row }" />
    </div>
    <div class="row-start-1 col-start-1 grid grid-cols-2 xl:grid-cols-1 gap-4 max-w-full">
      <FighterInfo v-for="i in 4" :fighter="fighterData[i as 1 | 2 | 3 | 4]" :key="i" class="flex-1 w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { fighterData } from './models/Fighter'
import { computed, onMounted, ref } from 'vue'
import { useStorage, useWindowSize } from '@vueuse/core'
import { useStore } from './store'
import constants from "./constants";
import BoardTile from './components/BoardTile.vue'
import FighterInfo from './components/FighterInfo.vue'
import ReachableTileOverlay from './components/ReachableTileOverlay.vue';
import Title from "./components/Title.vue";

const animate = useStorage('animate', true)
let isMounted = ref(false)
let isAnimated = ref(false)
onMounted(() => {
  setTimeout(() => isMounted.value = true, 0)
  setTimeout(() => isAnimated.value = true, 3500)
})

const store = useStore()

const windowSize = useWindowSize()

const gridSize = computed(() => `${Math.ceil(Math.min(windowSize.height.value * 0.7, windowSize.width.value * 0.95))}px`) 
</script>

<style>
#board-grid * {
  overflow: hidden;
}
</style>