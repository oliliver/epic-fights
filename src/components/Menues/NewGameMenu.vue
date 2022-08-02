<template>
  <BaseMenu heading="New Game" :menu-name="MenuName.NEW_GAME">
    <div class="text-left flex flex-col gap-1">
      <div v-for="(player, i) in players" class="p-2 border flex flex-col gap-2 border-gray-400 rounded"
        :style="{ backgroundColor: player.colorValue(200) }">
        <div class="flex justify-between">
          <input v-model="player.name" class="bg-transparent border-b" :style="{ borderColor: player.colorValue() }">
          <button v-if="i > 1" @click="gameStore.removePlayer(player)"
            class="px-1 py-0 leading-none -mx-1 -mt-1 hover:bg-white rounded hover:bg-opacity-50">
            <div>&times;</div>
          </button>
        </div>
        <div class="grid grid-cols-4 gap-2">
          <div v-for="tile in player.tiles" class="flex relative transition-colors cursor-pointer"
            :class="selectedTiles[player.id] == tile.id && 'shadow-inner'"
            :style="{ height: tileSize, width: tileSize, backgroundColor: selectedTiles[player.id] == tile.id ? player.colorValue(300) : player.colorValue() }"
            @click="selectTile(player, tile)">
            <FighterToken class="m-auto" v-if="getFighter(tile)" :fighter="getFighter(tile)" />
          </div>
        </div>
        <hr class="border-gray-400" />
        <div class="grid grid-cols-4 gap-2">
          <div v-for="fighterInPool in availableFighters" class="flex bg-white bg-opacity-50 relative"
            :class="numberOfFightersLeft(player, fighterInPool) === 0 ? 'opacity-40 cursor-default' : 'cursor-pointer'"
            @click="selectFighter(player, fighterInPool)" :style="{ height: tileSize, width: tileSize }">
            <p class="absolute right-0 bottom-0 leading-none m-1 font-bold text-cyan-500 text-clamp-sm">x{{
                numberOfFightersLeft(player, fighterInPool)
            }}
            </p>
            <FighterToken class="m-auto" :fighter="fighterInPool.fighter" />
          </div>
        </div>
      </div>

      <button v-if="players.length < gameStore.static.playerSlots.length" @click="gameStore.addPlayer"
        class="self-center mx-auto p-2 hover:bg-gray-100 rounded flex items-center gap-2 text-cyan-600">
        <span class="-translate-y-px">&plus;</span><span> Add Player</span>
      </button>
    </div>
    <BaseButton :disabled="!allPlayersHaveFourFighters" class="font-[bangers] mt-2 inverted"
      :color="constants.COLORS.amber[500]" @click="startGame">
      Start!
    </BaseButton>
  </BaseMenu>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import Player, { PlayerType } from "../../models/Player";
import FighterToken from "../FighterToken.vue";
import Tile from "../../models/Tile";
import Fighter from "../../models/Fighter";
import { FighterInPool, MenuName } from "../../store/types";
import { useStore, useGameStore } from '../../store'
import BaseButton from "../BaseButton.vue";
import constants from '../../constants'
import BaseMenu from "./BaseMenu.vue";
import { useWindowSize } from "@vueuse/core";
import { storeToRefs } from "pinia";

const store = useStore()
const gameStore = useGameStore()

const { players } = storeToRefs(gameStore)

function getFighter(tile: Tile) {
  return tile.fightersOnTile.find(f => f.isAlive) as Fighter
}

const availableFighters = gameStore.static.fighterPool
const numberOfFightersLeft = (player: PlayerType, fighterData: FighterInPool) => {
  const numberOfFightersUsed = player.fighters.filter(f => f.fighterId == fighterData.fighter.fighterId).length

  return fighterData.maxCount - numberOfFightersUsed
}

const selectedTiles = reactive<{ [playerId: string]: number | null }>({})
function selectTile(player: PlayerType, targetTile: Tile) {
  const currentlySelectedTile = player.tiles.find(t => t.id == selectedTiles[player.id])
  const fighterOnCurrentlySelectedTile = currentlySelectedTile?.fightersOnTile.find(f => f.isAlive) ?? null
  const targetTileIsTheCurrentlySelected = selectedTiles[player.id] === targetTile.id

  if (!currentlySelectedTile) {
    selectedTiles[player.id] = targetTile.id
    return
  }

  if (!targetTileIsTheCurrentlySelected && !fighterOnCurrentlySelectedTile) {
    selectedTiles[player.id] = targetTile.id
    return
  }


  if (targetTileIsTheCurrentlySelected && !fighterOnCurrentlySelectedTile) {
    selectedTiles[player.id] = null
    return
  }

  if (targetTileIsTheCurrentlySelected && fighterOnCurrentlySelectedTile) {
    player.removeFighter(fighterOnCurrentlySelectedTile)
    return
  }

  if (!targetTileIsTheCurrentlySelected && fighterOnCurrentlySelectedTile) {
    player.removeFighter(fighterOnCurrentlySelectedTile)

    const fighterOnTargetTile = targetTile?.fightersOnTile.find(f => f.isAlive) ?? null

    if (fighterOnTargetTile) {
      player.removeFighter(fighterOnTargetTile)
      player.addFighter(fighterOnTargetTile, currentlySelectedTile)
    }

    player.addFighter(fighterOnCurrentlySelectedTile, targetTile)

    selectedTiles[player.id] = null
  }
}

function selectFighter(player: PlayerType, fighterInPool: FighterInPool) {
  if (numberOfFightersLeft(player, fighterInPool) <= 0) return

  const tileHasFighter = (tile: Tile) => tile.fightersOnTile.some(f => f.isAlive)

  const targetTile = player.tiles.find(tile => selectedTiles[player.id] ? tile.id == selectedTiles[player.id] : !tileHasFighter(tile))

  if (targetTile) {
    player.addFighter(fighterInPool.fighter, targetTile)
  }

  selectedTiles[player.id] = null
}

const allPlayersHaveFourFighters = computed(() => players.value.every(p => p.fighters.length == 4))

function startGame() {
  gameStore.startGame()
  store.setActiveMenu(MenuName.null)
}

const windowSize = useWindowSize()

const minScreenSize = computed(() => Math.min(windowSize.height.value, windowSize.width.value))
const tileSize = computed(() => `${Math.round(minScreenSize.value * 0.12)}px`)
</script>