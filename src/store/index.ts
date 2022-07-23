import constants from '../constants'
import Fighter from '../models/Fighter'
import Player from '../models/Player'
import Tile from '../models/Tile'
import { defineStore } from 'pinia'
import { MainStoreData } from './types'
import { getFighterOnTile, getOrthogonallyDiagonalTiles, getTileIdFromPosition, isWithinGrid, isWithinRangeOrthogonally } from './helpers'
import { ReachableTile } from '../models/types'

export const useStore = defineStore('main', {
  state(): MainStoreData {
    return {
      selectedPawn: null,
      tiles: [],
      reachableTiles: [],
      reachableTilesKeyedById: {},
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

      this.reachableTiles = []
      this.reachableTilesKeyedById = {}

      let edgeTiles = [tile]

      for (let i = 0; i < fighter.movementPoints; i++) {
        const newEdgeTiles: ReachableTile[] = []

        edgeTiles.forEach(edgeTile => {
          const orthogonallyDiagonalTiles = getOrthogonallyDiagonalTiles(edgeTile)
          const isAlreadyAdded = (tile: Tile) => !!this.reachableTilesKeyedById[tile.id]
          const isValidForThisFighter = (tile: Tile) => (!tile.isEdgeTile || (fighter.startingTile.id !== this.selectedPawn?.tile.id && fighter.startingTile.id == tile.id))

          const accessibleTiles = orthogonallyDiagonalTiles.filter(tile =>
            isWithinRangeOrthogonally(tile, edgeTile, 1) &&
            !isAlreadyAdded(tile) &&
            isValidForThisFighter(tile) &&
            isWithinGrid(tile)
          )

          accessibleTiles.forEach(tile => {
            const reachableTile = { ...tile, numberOfStepsAway: i + 1 }

            if (!tile.isOccupied()) {
              newEdgeTiles.push(reachableTile)
            }

            this.reachableTiles.push(reachableTile)
            this.reachableTilesKeyedById[tile.id] = reachableTile
          })
        })

        edgeTiles = newEdgeTiles
      }
    },
    deselectPawn() {
      this.selectedPawn = null
      this.reachableTiles = []
    },
    moveSelectedPawn(targetTile: Tile) {
      const targetFighter = this.selectedPawn?.fighter
      const { col, row } = targetTile

      if (!targetFighter) return

      [targetFighter.position.col, targetFighter.position.row] = [col, row]
      this.deselectPawn()
    },
    applyDamage(defender: Fighter, damage: number) {
      defender.healthPoints -= damage

      if (defender.healthPoints <= 0) {
        defender.isAlive = false
      }
    },
    attackPawn(defender: Fighter) {
      const attacker = this.selectedPawn?.fighter

      if (!attacker || !defender) return

      const damage = Math.max(0, attacker.attackPoints - defender.defensePoints)

      this.applyDamage(defender, damage)

      if (!defender.isAlive && attacker.range == 1) {
        const defenderTile = this.tiles[getTileIdFromPosition(defender.position)]
        this.moveSelectedPawn(defenderTile)
      }

      this.deselectPawn()
    },
  },
  getters: {
    fightersOnTiles: state => {
      return state.tiles.reduce((acc: { [tileId: string | number]: Fighter | undefined }, tile) => ({
        ...acc,
        [String(tile.id)]: getFighterOnTile(state.players, tile)
      }), {})
    },
    selectedPawnId: state => state.selectedPawn?.fighter.id,
    selectedPlayerId: state => state.selectedPawn?.fighter.player.id
  }
})