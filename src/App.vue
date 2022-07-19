
<template>
  <div class="absolute inset-0 bg-white transition-opacity duration-[.75s] delay-[3s] ease-linear"
    :class="isMounted || !animate ? 'opacity-0' : 'opacity-100'" />
  <div
    class="absolute left-1/2 -translate-x-1/2 text-center z-10 transition-[margin] delay-1000 duration-[2s] h-32 flex flex-col justify-center"
    :class="isMounted || !animate ? 'mt-0' : 'mt-[40vh]'">
    <h1 class="leading-none font-[Bangers] mx-auto text-[4rem]">Epic Fights</h1>
    <hr class="mb-1 border-gray-900" />
    <h2 class="leading-none tracking-narrow text-sm italic text-gray-700">made by Oliver Lukas Björn Riksfjord</h2>
  </div>
  <label for="animate"
    class="absolute right-12 top-6 flex gap-2 select-none cursor-pointer text-gray-700 hover:text-gray-900">
    <input id="animate" type="checkbox" v-model="animate" />
    <span>Splashscreen</span>
  </label>
  <div class="grid grid-cols-4 gap-4 items-stretch flex-1 grid-rows-4 p-32">
    <FighterInfo v-for="i in 4" class="col-start-1 h-full" :fighter="fighterData[i as 1 | 2 | 3 | 4]" :key="i" />
    <div
      class="col-span-2 w-full row-span-4 col-start-2 row-start-1 inline-grid grid-cols-6 grid-rows-6 gap-1 bg-gray-900 p-4 rounded-md mx-auto">
      <div v-for="tile in tiles" class="  flex flex-col" :class="[
        tile.isCornerTile && 'opacity-0',
        getBackgroundColor(tile.id)
      ]" :key="tile.id">
        <div v-if="fightersOnTiles[tile.id]"
          class="rounded-full bg-gray-100 h-1/2 w-1/2 m-auto flex flex-col items-center justify-center">
          <strong>
            {{ fightersOnTiles[tile.id]?.tier }}
          </strong>
          <strong class="text-red-500">
            {{ fightersOnTiles[tile.id]?.healthPoints }}
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import worldData from './worldData'
import Tile from './models/Tile'
import Fighter, { fighterData } from './models/Fighter'
import FighterInfo from './components/FighterInfo.vue'
import constants from './constants'
import { onMounted, ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

const { tiles, players } = worldData

const animate = useStorage('animate', true)

function getBackgroundColor(index: number) {
  for (const player of players) {
    if (player.tiles.some(tile => tile.id == index)) {
      return `${constants.colors.bg[player.color]} rounded-sm`
    }
  }

  return 'bg-gray-100'
}

function getFighterOnTile(tile: Tile) {
  let fighter = undefined
  let playerIndex = 0

  while (fighter === undefined) {
    const player = players[playerIndex]

    if (!player) break

    fighter = player?.fighters.find(fighter => fighter.isOnTile(tile))

    playerIndex++
  }

  return fighter
}

const fightersOnTiles = computed(() => tiles.reduce((acc: { [index: number]: Fighter | undefined }, tile) => {
  acc[tile.id] = getFighterOnTile(tile)
  return acc
}, {}))

let isMounted = ref(false)

onMounted(() => setTimeout(() => isMounted.value = true))
</script>

