
<template>
  <div
    class="absolute left-1/2 -translate-x-1/2 text-center z-10 transition-[margin] delay-1000 duration-[2s] h-32 flex flex-col justify-center"
    :class="isMounted || !animate ? 'mt-0' : 'mt-[40vh]'">
    <h1 class="leading-none font-[Bangers] mx-auto text-[4rem]">Epic Fights</h1>
    <hr class="mb-1 border-gray-900" />
    <h2 class="leading-none tracking-narrow text-sm italic text-gray-700">made by Oliver Lukas Björn Riksfjord</h2>
  </div>
  <div
    class="grid grid-cols-4 gap-4 items-stretch flex-1 grid-rows-4 p-32 absolute inset-0 bg-white transition-opacity duration-[.75s] delay-[3s] ease-linear"
    :class="isMounted || !animate ? 'opacity-100' : 'opacity-0'">
    <FighterInfo v-for="i in 4" class="col-start-1 h-full" :fighter="fighterData[i as 1 | 2 | 3 | 4]" :key="i" />
    <div
      class="col-span-2 w-full row-span-4 col-start-2 row-start-1 inline-grid gap-1 bg-gray-900 p-4 rounded-md mx-auto"
      :style="{
        gridTemplateColumns: `repeat(${constants.GRID_WIDTH}, 1fr)`,
        gridTemplateRows: `repeat(${constants.GRID_HEIGHT}, 1fr)`
      }">
      <ReachableTileOverlay v-for="tile in store.reachableTiles" :tile="tile"
        :style="{ gridColumnStart: tile.col, gridRowStart: tile.row }" />
      <BoardTile v-for="tile in store.tiles" :tile="tile"
        :style="{ gridColumnStart: tile.col, gridRowStart: tile.row }" />
    </div>
  </div>
  <label for="animate"
    class="absolute right-12 top-6 flex gap-2 select-none cursor-pointer text-gray-700 hover:text-gray-900">
    <input id="animate" type="checkbox" v-model="animate" />
    <span>Splashscreen</span>
  </label>
</template>

<script setup lang="ts">
import { fighterData } from './models/Fighter'
import { onMounted, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useStore } from './store'
import constants from "./constants";
import BoardTile from './components/BoardTile.vue'
import FighterInfo from './components/FighterInfo.vue'
import ReachableTileOverlay from './components/ReachableTileOverlay.vue';

const animate = useStorage('animate', true)
let isMounted = ref(false)
onMounted(() => setTimeout(() => isMounted.value = true))

const store = useStore()


</script>

