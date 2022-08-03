
<template>
  <transition name="fade" mode="out-in" appear>
    <GameMenu v-if="store.initialized && store.activeMenu !== MenuName.null" class="absolute inset-0 z-50" />
  </transition>
  <div class="h-screen overflow-y-auto flex flex-col relative">
    <div class="absolute right-2 top-2 hover:bg-gray-200 rounded p-1 cursor-pointer"
      @click="store.setActiveMenu(MenuName.MAIN_MENU)">
      <svg class="text-gray-900 fill-current" viewBox="0 0 24 24" height="24" width="24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 4C11.4477 4 11 4.44772 11 5C11 6.69226 8.95399 7.53974 7.75738 6.34314C7.36686 5.95261 6.73369 5.95261 6.34317 6.34314C5.95265 6.73366 5.95265 7.36683 6.34317 7.75735C7.53982 8.954 6.69223 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13C6.69236 13 7.53964 15.0461 6.34311 16.2426C5.95258 16.6332 5.95258 17.2663 6.34311 17.6569C6.73363 18.0474 7.36679 18.0474 7.75732 17.6569C8.9539 16.4603 11 17.3077 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 17.3077 15.046 16.4602 16.2427 17.6568C16.6332 18.0474 17.2664 18.0474 17.6569 17.6568C18.0474 17.2663 18.0474 16.6332 17.6569 16.2426C16.4603 15.0461 17.3077 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C17.3078 11 16.4601 8.95405 17.6568 7.75737C18.0473 7.36684 18.0473 6.73368 17.6568 6.34315C17.2663 5.95263 16.6331 5.95263 16.2426 6.34315C15.046 7.53979 13 6.69219 13 5C13 4.44772 12.5523 4 12 4ZM9.00816 4.77703C9.12224 3.2243 10.4181 2 12 2C13.5819 2 14.8778 3.2243 14.9918 4.77703C16.1704 3.75977 17.9525 3.8104 19.071 4.92894C20.1896 6.04748 20.2402 7.82955 19.2229 9.00816C20.7757 9.12221 22 10.4181 22 12C22 13.5819 20.7757 14.8778 19.223 14.9918C20.2403 16.1704 20.1896 17.9525 19.0711 19.0711C17.9525 20.1896 16.1705 20.2402 14.9918 19.2229C14.8778 20.7757 13.5819 22 12 22C10.4181 22 9.12221 20.7757 9.00816 19.2229C7.82955 20.2402 6.04745 20.1896 4.92889 19.0711C3.81034 17.9525 3.75972 16.1704 4.77702 14.9918C3.2243 14.8778 2 13.5819 2 12C2 10.4181 3.22433 9.12221 4.77709 9.00816C3.75978 7.82955 3.81041 6.04747 4.92896 4.92892C6.0475 3.81038 7.82955 3.75975 9.00816 4.77703Z" />
        <path
          d="M12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.4696 13.7893 10.9609 13.4142 10.5858C13.0391 10.2107 12.5304 10 12 10ZM9.17157 9.17157C9.92172 8.42143 10.9391 8 12 8C13.0609 8 14.0783 8.42143 14.8284 9.17157C15.5786 9.92172 16 10.9391 16 12C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16C10.9391 16 9.92172 15.5786 9.17157 14.8284C8.42143 14.0783 8 13.0609 8 12C8 10.9391 8.42143 9.92172 9.17157 9.17157Z" />
      </svg>
    </div>
    <div v-if="gameStore.winner"
      class="absolute top-[10%] left-1/2 -translate-x-1/2 font-[Bangers] z-50 bg-white p-6 rounded shadow-2xl"
      :style="{ color: gameStore.winner.colorValue() }">
      <p>{{ gameStore.winner.name }} wins the game!</p>
      <BaseButton class="w-full mt-10" @click="store.setActiveMenu(MenuName.NEW_GAME)">
        New Game</BaseButton>
    </div>
    <Title class="opacity-0 mx-auto" />
    <Title class="absolute left-[49.5vw] -translate-x-1/2 transition-[margin,transform]"
      :class="[!isMounted && store.settings.useSplashScreen && 'mt-[35vh] scale-[2]']" :style="{
        transitionDelay: `${animationDuration * (1 / 3)}ms`,
        transitionDuration: `${animationDuration * (2 / 3)}ms`,
      }" />
    <transition name="fade" mode="out-in" appear>
      <div v-if="isAnimated" class="flex flex-col flex-1 pb-4">
        <div class="flex-1 flex flex-col items-center justify-center transition-opacity py-2"
          :class="gameStore.currentTurn.number > 0 ? 'opacity-100' : 'opacity-0'">
          <p class="font-semibold leading-snug text-amber-500">Turn {{ gameStore.currentTurn.number }}</p>
          <p class="font-semibold leading-snug" :style="{ color: activePlayer?.colorValue() }">{{ activePlayer?.name }}
          </p>
        </div>
        <div
          class="xl:w-full flex flex-col justify-start xl:grid mx-auto gap-4 items-stretch bg-white transition-opacity duration-[.75s] ease-linear"
          :class="[isAnimated ? 'opacity-100' : 'opacity-0']" :style="{
            gridTemplateColumns: '1fr min-content 1fr',
            gridTemplateRows: gridSize,
          }">
          <div v-if="store.initialized" id="board-grid"
            class="w-full relative flex-none col-start-2 grid bg-gray-900 rounded-md mx-auto" :style="{
              gridTemplateColumns: `repeat(${constants.GRID_WIDTH}, 1fr)`,
              gridTemplateRows: `repeat(${constants.GRID_HEIGHT}, 1fr)`,
              gridGap: gridGap,
              padding: gridPadding,
              height: gridSize,
              width: gridSize
            }">
            <BoardTile v-for="tile in gameStore.static.tiles" :tile="tile"
              :style="{ gridColumnStart: tile.col, gridRowStart: tile.row }" />
            <TileBackgroundOverlayActivePlayer v-if="selectedPlayer?.isActive()"
              v-for="tile in boardStore.reachableTiles" :tile="tile"
              :style="{ gridColumnStart: tile.col, gridRowStart: tile.row }" />
            <TileBackgroundOverlayInactivePlayer v-else v-for="tile in boardStore.reachableTiles"
              :style="{ gridColumnStart: tile.col, gridRowStart: tile.row }" />
            <div v-for="fighter in allLivingFighters" class="flex flex-col h-full w-full z-20"
              :style="{ gridColumnStart: fighter.currentTile.col, gridRowStart: fighter.currentTile.row }">
              <FighterPawn :fighter="fighter" />
            </div>

            <AbilityOverlay :gridSizes="{
              gridSize, gridGap, gridPadding
            }" :selectedTile="selectedTile" />
          </div>
        </div>
        <div class="flex py-4">
          <BaseButton v-if="gameStore.winner || !gameStore.players.length"
            class="font-[Oswald] font-normal m-auto w-64 inverted" :color="constants.COLORS.amber[500]"
            @click="store.setActiveMenu(MenuName.NEW_GAME)">
            New Game
          </BaseButton>
          <BaseButton v-else :disabled="nextTurnButtonDisabled" class="font-[Oswald] font-normal m-auto w-64 inverted"
            :color="activePlayer?.colorValue() || 'gray'" @click="gameStore.nextTurn()">
            End Turn
          </BaseButton>
        </div>
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 px-4">
          <FighterInfo v-for="i in 4" :fighter="fighterService.createFighter({ fighterId: i })" :key="i" />
        </div>
        <div class="flex-1"></div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import BaseButton from './components/BaseButton.vue';
import BoardTile from './components/BoardTile.vue'
import constants from "./constants";
import FighterInfo from './components/FighterInfo.vue'
import FighterPawn from './components/FighterPawn.vue'
import GameMenu from './components/Menues/GameMenu.vue';
import TileBackgroundOverlayActivePlayer from './components/TileBackgroundOverlayActivePlayer.vue';
import TileBackgroundOverlayInactivePlayer from './components/TileBackgroundOverlayInactivePlayer.vue';
import Title from "./components/Title.vue";
import fighterService from "./services/fighterService";
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useStore, useGameStore, useBoardStore } from './store'
import { MenuName } from "./store/types";
import AbilityOverlay from './components/AbilityOverlay.vue';

const boardStore = useBoardStore()
const gameStore = useGameStore()
const store = useStore()
const showGameMenuOnEsc = (event: KeyboardEvent) => {
  if (event.key == 'Escape') {
    store.setActiveMenu(
      store.activeMenu === MenuName.null ? MenuName.MAIN_MENU : MenuName.null
    )
  }
}

const selectedTile = computed(() => boardStore.selectedPawn?.fighter?.currentTile)

const animationDuration = 3000
const isMounted = ref(false)
const isAnimated = ref(false)
const nextTurnButtonDisabled = ref(false)

let nextTurnButtonDisabledTimer: number
watch(() => gameStore.currentTurn.number, () => {
  nextTurnButtonDisabled.value = true

  if (nextTurnButtonDisabledTimer) {
    clearTimeout(nextTurnButtonDisabledTimer)
  }

  nextTurnButtonDisabledTimer = setTimeout(() => {
    nextTurnButtonDisabled.value = false
  }, 1000);
})

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 0)

  setTimeout(() => {
    store.setActiveMenu(MenuName.MAIN_MENU)
    isAnimated.value = true
  }, store.settings.useSplashScreen ? animationDuration : 0)

  document.addEventListener('keydown', showGameMenuOnEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', showGameMenuOnEsc)
})


const windowSize = useWindowSize()

const gridSize = computed(() => `${Math.ceil(Math.min(windowSize.height.value * 0.7, windowSize.width.value * 0.95))}px`)
const gridGap = '0.25rem'
const gridPadding = '1rem'

const activePlayer = computed(() => gameStore.activePlayer)
const selectedPlayer = computed(() => gameStore.players.find(p => p.id == boardStore.selectedPlayerId))

const allLivingFighters = computed(() => gameStore.players.flatMap(p => p.fighters).filter(f => f.isAlive))
</script>

<style>
#board-grid * {
  overflow: hidden;
}
</style>