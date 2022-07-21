import Player from '../models/Player'
import Tile from '../models/Tile'
import constants from '../constants'
import { defineStore } from 'pinia'
import { MainStoreData } from './types'
import Fighter from '../models/Fighter'
import { getFighterOnTile, getOrthogonallyDiagonalTiles, isWithinGrid, isWithinRangeOrthogonally } from './helpers'

export const useStore = defineStore('main', {
  state(): MainStoreData {
    return {
      selectedPawn: null,
      tiles: [],
      reachableTiles: [],
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

      Object.freeze(this.tiles)

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

      const allReachableTiles = []
      let edgeTiles = [tile]

      for (let i = 0; i < fighter.movementPoints; i++) {
        const newEdgeTiles: Tile[] = []

        edgeTiles.forEach(edgeTile => {
          const orthogonallyDiagonalTiles = getOrthogonallyDiagonalTiles(edgeTile)

          const reachableTiles = orthogonallyDiagonalTiles.filter(tile =>
            isWithinGrid(tile) &&
            isWithinRangeOrthogonally(tile, edgeTile, 1) &&
            !edgeTiles.includes(tile) &&
            !tile.isOccupied() &&
            (!tile.isEdgeTile || fighter.startingTile.id == tile.id)
          )

          newEdgeTiles.push(...reachableTiles)
        })

        allReachableTiles.push(...newEdgeTiles)
        edgeTiles = newEdgeTiles
      }

      this.reachableTiles = [...new Set(allReachableTiles)]
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