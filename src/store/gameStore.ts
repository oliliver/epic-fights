import fighterService from "../services/FighterService";
import Tile from '../models/Tile'
import constants, { ColorName } from '../constants'
import Player, { TPlayer } from "../models/Player"
import { defineStore } from "pinia"
import { GameState, PlayerAction } from "./types"
import { useBoardStore } from ".";
import { throwError } from './helpers'
import { AbilityType, Passivity, TAbility } from '../models/types';

export const useGameStore = defineStore('gameStore', {
  state(): GameState {
    return {
      activePlayer: null,
      activePlayerData: {
        id: null,
        selectedAction: null,
        availableActions: {
          movement: {
            isUsed: false,
            isAllowed: () => !useGameStore().activePlayerData.availableActions.ability.isUsed,
            isPossible: () => !!useBoardStore().selectedPawn?.fighter.canMove(),
          },
          ability: {
            isUsed: false,
            isAllowed: () => true,
            isPossible: () => !!useBoardStore().selectedPawn?.fighter.abilities.some(a => a.passivity == Passivity.ACTIVE && a.isPossible())
          }
        }
      },
      currentTurn: {
        number: 0,
      },
      players: [],
      randomizedTurnOrderOffset: 0,
      static: {
        fighterPool: [],
        tiles: [],
        playerSlots: [
          {
            defaultColor: ColorName.sky,
            tiles: [],
          },
          {
            defaultColor: ColorName.lime,
            tiles: [],
          },
          {
            defaultColor: ColorName.amber,
            tiles: [],
          },
          {
            defaultColor: ColorName.rose,
            tiles: [],
          },
        ]
      },
      winner: null,
    }
  },
  actions: {
    addPlayer() {
      const playerSlotIndex = this.static.playerSlots.findIndex((_, i) => !this.players.some(p => p.slotIndex == i))

      if (playerSlotIndex !== -1) {
        const slot = this.static.playerSlots[playerSlotIndex]
        this.players.push(new Player({
          color: slot.defaultColor,
          tiles: slot.tiles,
          slotIndex: playerSlotIndex
        }))
      }
    },
    evaluateWinCondition() {
      const playersWithFightersAlive = this.players.filter(p => p.fighters.some(f => f.isAlive))

      if (playersWithFightersAlive.length == 1) {
        this.winner = playersWithFightersAlive[0]
      }
    },
    initializeGameStore() {
      const { GRID_HEIGHT, GRID_WIDTH } = constants

      let tileId = 0

      for (let row = 1; row <= GRID_HEIGHT; row++) {
        for (let col = 1; col <= GRID_WIDTH; col++) {
          this.static.tiles.push(new Tile(tileId++, row, col))
        }
      }

      this.static.playerSlots[0].tiles = this.static.tiles.filter(tile => !tile.isCornerTile && tile.isInFirstRow)
      this.static.playerSlots[1].tiles = this.static.tiles.filter(tile => !tile.isCornerTile && tile.isInLastRow)
      this.static.playerSlots[2].tiles = this.static.tiles.filter(tile => !tile.isCornerTile && tile.isInFirstCol)
      this.static.playerSlots[3].tiles = this.static.tiles.filter(tile => !tile.isCornerTile && tile.isInLastCol)

        ;[1, 2, 3, 4].forEach(
          fighterId => this.static.fighterPool.push({
            fighter: fighterService.createFighter({ fighterId }),
            maxCount: 2
          })
        )
    },
    nextTurn() {
      this.currentTurn.number++

      const newActivePlayer = this.players.find(
        p => (p.slotIndex + 1) == (
          ((this.currentTurn.number + this.randomizedTurnOrderOffset) % this.players.length) || this.players.length
        )
      )

      if (!newActivePlayer) {
        return throwError('NO_PLAYER_FOUND', 'nextTurn')
      }

      this.activePlayer = newActivePlayer
      this.activePlayerData = { ...this.activePlayerData, id: newActivePlayer.id }

      this.resetPlayerActions()
      this.activePlayer.doNewTurnUpkeep()

      useBoardStore().deselectPawn()
    },
    removePlayer(player: TPlayer) {
      const index = this.players.findIndex(p => p.id == player.id)

      if (index !== -1) {
        this.players.splice(index, 1)
      }
    },
    resetPlayerActions() {
      Object.keys(this.activePlayerData.availableActions).forEach((action) => {
        this.activePlayerData.availableActions[action as PlayerAction].isUsed = false
      })
    },
    selectFighterAbility(ability: TAbility) {
      const selectedFighter = useBoardStore().selectedPawn?.fighter

      if (!selectedFighter) return

      if (ability.abilityTypes.includes(AbilityType.ATTACK_REPLACEMENT)) {
        selectedFighter.changeAttack(ability)
      } else if (ability.passivity == Passivity.ACTIVE) {
        selectedFighter.performAbility(ability)
      }
    },
    setupNewGame() {
      this.winner = null

      while (this.players.length < 2) {
        this.addPlayer()
      }

      this.players.forEach(p => p.doNewGameUpkeep())
    },
    spendAction(action: PlayerAction) {
      this.activePlayerData.availableActions[action].isUsed = true

      const allAvailableActionsAreSpent = [...Object.values(this.activePlayerData.availableActions)].every(action => {
        return action.isUsed || !action.isAllowed() || !action.isPossible()
      })

      if (allAvailableActionsAreSpent) {
        this.nextTurn()
      }
    },
    startGame() {
      this.players.forEach(player => player.assignTileColors())
      this.currentTurn.number = 0

      this.randomizedTurnOrderOffset = Math.floor(Math.random() * this.players.length)

      this.nextTurn()
    },
  }
})