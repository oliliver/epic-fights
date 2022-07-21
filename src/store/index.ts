import Player from '../models/Player'
import Tile from '../models/Tile'
import constants from '../constants'
import { defineStore } from 'pinia'
import { GroupedPositionBoolean, MainStoreData } from './types'
import Fighter from '../models/Fighter'
import { getFighterOnTile } from './helpers'
import { GridPosition } from '../models/types'

export const useStore = defineStore('main', {
  state(): MainStoreData {
    return {
      selectedPawn: null,
      tiles: [],
      reachablePositions: {},
      players: [],
    }
  },
  actions: {
    initializeStore() {
      const { GRID_HEIGHT, GRID_WIDTH } = constants

      let tileId = 0

      for (let row = 1; row <= GRID_HEIGHT; row++) {
        for (let col = 1; col <= GRID_WIDTH; col++) {
          this.tiles.push(new Tile(tileId++, row, col))
        }
      }

      const player1 = new Player({
        tiles: this.tiles.filter(tile => !tile.isCornerTile && tile.isInFirstRow),
        color: 'blue',
      })
      const player2 = new Player({
        tiles: this.tiles.filter(tile => !tile.isCornerTile && tile.isInLastRow),
        color: 'green',
      })
      const player3 = new Player({
        tiles: this.tiles.filter(tile => !tile.isCornerTile && tile.isInFirstCol),
        color: 'yellow',
      })
      const player4 = new Player({
        tiles: this.tiles.filter(tile => !tile.isCornerTile && tile.isInLastCol),
        color: 'red',
      })

      this.players.push(player1, player2, player3, player4)
    },
    selectPawn(fighter: Fighter, tile: Tile) {
      if (!fighter || !tile) return

      this.selectedPawn = {
        fighter,
        tile,
      }

      // const { GRID_HEIGHT: rowMax, GRID_WIDTH: colMax } = constants
      // const [rowMin, colMin] = [1, 1]

      // type reachableTiles = {
      //   col: number,
      //   row: number,
      //   isReachable: boolean
      // }

      /* 
        THIS IS APPROPRIATE WHEN THERE IS NEED TO CALCULATE BLOCKED PATHS:
      */

      // const positionsMatrix = Array.from({ length: rowMax + 1 }).map((_, row) => Array.from({ length: colMax + 1 }).map((_, col) => ({ row, col, isReachable: false })))

      // let edgeTiles = [positionsMatrix[tile.row][tile.col]]

      // for (let i = 0; i < fighter.movementPoints; i++) {
      //   const newEdgeTiles: reachableTiles[] = []

      //   const col = (n: number) => Math.max(colMin, Math.min(n, colMax))
      //   const row = (n: number) => Math.max(rowMin, Math.min(n, rowMax))

      //   edgeTiles.forEach(p => {
      //     const reachableTiles = [...new Set([
      //       positionsMatrix[col(p.row + 1)][row(p.col + 0)],
      //       positionsMatrix[col(p.row - 1)][row(p.col + 0)],
      //       positionsMatrix[col(p.row + 0)][row(p.col + 1)],
      //       positionsMatrix[col(p.row + 0)][row(p.col - 1)],
      //     ])]

      //     reachableTiles.forEach(tile => {
      //       if (!tile.isReachable) {
      //         tile.isReachable = true
      //         newEdgeTiles.push(tile)
      //       }
      //     })
      //   })

      //   edgeTiles = newEdgeTiles
      // }

      // this.reachablePositions = positionsMatrix.flat().filter(p => p.isReachable).reduce((acc: GroupedPositionBoolean, pos) => ({ ...acc, [pos.col]: { ...acc[pos.col], [pos.row]: true } }), {})
    },
    deselectPawn() {
      this.selectedPawn = null
    },
    movePawn(targetTile: Tile) {
      const targetFighter = this.selectedPawn?.fighter
      const { col, row } = targetTile

      if (!targetFighter) return

      [targetFighter.position.col, targetFighter.position.row] = [col, row]
      this.deselectPawn()
    }
  },
  getters: {
    fightersOnTiles: state => {
      return state.tiles.reduce((acc: { [index: string | number]: Fighter | undefined }, tile) => ({
        ...acc,
        [String(tile.id)]: getFighterOnTile(state.players, tile)
      }), {})
    },
    selectedPawnId: state => state.selectedPawn?.fighter.id,
  }
})