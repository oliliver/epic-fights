import constants, { ColorName } from '../constants'
import Player from "../models/Player"
import Tile from '../models/Tile'
import { defineStore } from "pinia"
import { Fighter1, Fighter2, Fighter3, Fighter4 } from '../models/Fighter'
import { GameState, PlayerAction } from "./types"
import { useBoardStore } from ".";
import { throwError } from './helpers'

let currentTurnTimer: number

export const useGameStore = defineStore('gameStore', {
  state(): GameState {
    return {
      activePlayer: null,
      activePlayerData: {
        id: null,
        availableActions: {
          movement: {
            isUsed: false,
            isAllowed: () => !useGameStore().activePlayerData.availableActions.attack.isUsed,
            isPossible: () => !!useBoardStore().selectedPawn?.fighter.canMove(),
          },
          attack: {
            isUsed: false,
            isAllowed: () => true,
            isPossible: () => !!useGameStore().activePlayer?.fighters.some(f => f.isAlive && f.hasEnemyWithinAttackRange())
          }
        }
      },
      currentTurn: {
        number: 0,
        elapsedSeconds: 0
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

      const fighters = [new Fighter1(), new Fighter2(), new Fighter3, new Fighter4()]
      fighters.forEach(f => this.static.fighterPool.push({ fighter: f, maxCount: 2 }))


      if (this.players.length == 0) {
        const [player1, player2] = [0, 1].map(
          slotIndex => new Player({
            tiles: this.static.playerSlots[slotIndex].tiles,
            color: this.static.playerSlots[slotIndex].defaultColor, slotIndex
          })
        )

          ;[player1, player2].forEach(player => {
            player.addFighter(new Fighter4(), player.tiles[0])
            player.assignTileColors()
            this.players.push(player)
            this.startGame()
          })
      }
    },
    nextTurn() {
      this.currentTurn.number++
      this.currentTurn.elapsedSeconds = 0

      if (currentTurnTimer) {
        clearInterval(currentTurnTimer)
      }

      currentTurnTimer = setInterval(() => this.currentTurn.elapsedSeconds++, 1000)

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

      useBoardStore().deselectPawn()
    },
    resetPlayerActions() {
      Object.keys(this.activePlayerData.availableActions).forEach((action) => {
        this.activePlayerData.availableActions[action as PlayerAction].isUsed = false
      })
    },
    setupNewGame() {
      this.winner = null
    },
    spendAction(action: PlayerAction) {
      this.activePlayerData.availableActions[action].isUsed = true

      const allAvailableActionsAreSpent = Object.values(this.activePlayerData.availableActions).every(action => {
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