import { defineStore } from "pinia"
import { getOrthogonallyDiagonalTiles, isWithinGrid, isWithinRangeOrthogonally } from './helpers'
import { ReachableTile } from '../models/types'
import Fighter from '../models/Fighter'
import Tile from '../models/Tile'
import { BoardState, PlayerAction } from "./types"
import { useGameStore } from "./gameStore";

export const useBoardStore = defineStore('boardStore', {
  state(): BoardState {
    return {
      reachableTiles: [],
      reachableTilesKeyedById: {},
      selectedPawn: null,
    }
  },
  actions: {
    calculateReachableTiles(fighter: Fighter) {
      let edgeTiles = [fighter.currentTile]

      // calculate which tiles are reachable (via an unblocked path)
      for (let i = 0; i < fighter.movementPoints; i++) {
        const newEdgeTiles: ReachableTile[] = []

        edgeTiles.forEach(edgeTile => {
          const orthogonallyDiagonalTiles = getOrthogonallyDiagonalTiles(edgeTile)
          const isAlreadyAdded = (tile: Tile) => !!this.reachableTilesKeyedById[tile.id]

          const accessibleTiles = orthogonallyDiagonalTiles.filter(tile =>
            isWithinRangeOrthogonally(tile, edgeTile, 1) &&
            !isAlreadyAdded(tile) &&
            tile.isValidForFighter(fighter) &&
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
    calculateTilesWithinDistance(fighter: Fighter) {
      const origin = fighter.currentTile

      const isValidForThisFighter = (tile: Tile) => (!tile.isEdgeTile || (fighter.startingTile.id !== this.selectedPawn?.tile.id && fighter.startingTile.id == tile.id))
      const isWithinDistance = (tile: Tile) => Math.abs(tile.row - origin.row) + Math.abs(tile.col - origin.col) <= fighter.movementPoints

      this.reachableTiles = useGameStore().static.tiles.filter(tile => {
        return isWithinDistance(tile) && isValidForThisFighter(tile)
      })
    },
    resetReachableTiles() {
      this.reachableTiles = []
      this.reachableTilesKeyedById = {}
    },
    selectPawn(fighter: Fighter) {
      this.selectedPawn = {
        fighter,
        tile: fighter.currentTile,
        player: fighter.player,
      }

      this.resetReachableTiles()

      if (fighter.player.isActive()) {
        this.calculateReachableTiles(fighter)
      } else {
        this.calculateTilesWithinDistance(fighter)
      }
    },
    deselectPawn() {
      this.selectedPawn = null
      this.resetReachableTiles()
    },
    applyDamage(defender: Fighter, damage: number) {
      const gameStore = useGameStore()

      defender.healthPoints -= damage

      if (defender.healthPoints <= 0) {
        defender.isAlive = false
      }

      gameStore.evaluateWinCondition()
    },
    attackPawn(defender: Fighter) {
      const gameStore = useGameStore()
      const attacker = this.selectedPawn?.fighter

      if (!defender || !attacker?.player.isActive()) return

      const damage = Math.max(0, attacker.attackPoints - defender.defensePoints)

      this.applyDamage(defender, damage)

      if (!defender.isAlive && attacker.range == 1) {
        const defenderTile = gameStore.static.tiles[defender.currentTile.id]
        attacker.moveToTile(defenderTile)
      }

      this.deselectPawn()
      gameStore.spendAction(PlayerAction.attack)
    },
    moveSelectedPawn(targetTile: Tile) {
      const fighter = this.selectedPawn?.fighter

      if (!fighter) return

      try {
        fighter.moveToTile(targetTile)

        if (fighter.hasEnemyWithinAttackRange()) {
          this.resetReachableTiles()
          this.calculateReachableTiles(fighter)
        } else {
          this.deselectPawn()
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  getters: {
    fightersKeyedByTileId: () => {
      const gameStore = useGameStore()

      return gameStore.static.tiles.reduce((acc: { [tileId: string]: Fighter | undefined }, tile) => ({
        ...acc,
        [String(tile.id)]: tile.fightersOnTile.find(f => f.isAlive)
      }), {})
    },
    selectedPawnId: state => state.selectedPawn?.fighter.id,
    selectedPlayerId: state => state.selectedPawn?.fighter.player.id,
    activePlayerId: () => useGameStore().activePlayer?.id,
  }
})