import Ability from './Ability'
import constants from '../constants'
import Tile, { neutralTile } from './Tile'
import { PlayerType, neutralPlayer } from './Player'
import { AbilityType, FighterData, Passivity } from './types'
import { nanoid } from 'nanoid'
import { useGameStore } from '../store'
import { PlayerAction } from '../store/types'
import { getOrthogonallyDiagonalTiles, throwError } from '../store/helpers'
export default class Fighter {
  public healthPoints: number
  public isAlive = true
  public player: PlayerType
  public currentTile: Tile

  readonly abilities: AbilityType[]
  readonly attackPoints: number
  readonly defensePoints: number
  readonly fighterId: number
  readonly healthPointsMax: number
  readonly id: string
  readonly movementPoints: number
  readonly range: number
  readonly startingTile: Tile
  readonly tier: number

  constructor(initialData: FighterData & {
    startingTile?: Tile
    player?: PlayerType
  }) {
    this.abilities = initialData.abilities?.map(a => new Ability(a, this)) ?? []
    this.attackPoints = initialData.attackPoints
    this.defensePoints = initialData.defensePoints
    this.fighterId = initialData.fighterId
    this.healthPoints = constants.DEFAULT_HP
    this.healthPointsMax = constants.DEFAULT_HP
    this.id = nanoid()
    this.movementPoints = initialData.movementPoints
    this.player = initialData.player ?? neutralPlayer
    this.currentTile = neutralTile
    this.startingTile = initialData.startingTile ?? neutralTile
    this.range = initialData.range
    this.tier = initialData.tier

    this.moveToTile(this.startingTile, { isAnAction: false })
  }

  public moveToTile(targetTile: Tile, options: { isAnAction: boolean } = { isAnAction: true }) {
    if (options.isAnAction && !this.player.canPerformAction(PlayerAction.movement)) {
      throwError('NOT_ENOUGH_ACTION_POINTS', 'Fighter.moveToTile')
    }

    try {
      targetTile.addFighter(this)
      this.currentTile.removeFighter(this)
      this.currentTile = targetTile

      const gameStore = useGameStore()

      if (options.isAnAction) {
        gameStore.spendAction(PlayerAction.movement)
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * hasEnemyWithinAttackRange
   * @returns boolean
   */
  public hasEnemyWithinAttackRange() {
    return getOrthogonallyDiagonalTiles(this.currentTile)
      .some(t => t.fightersOnTile
        .some(f => f.player.id !== this.player.id && f.isAlive)
      )
  }

  public canMove() {
    return getOrthogonallyDiagonalTiles(this.currentTile)
      .some(t => !t.isOccupied() && t.isValidForFighter(this))
  }

  public returnToStartingTile() {
    if (this.currentTile !== this.startingTile) {
      this.moveToTile(this.startingTile, { isAnAction: false })
    }
  }

  public getDamageModification() {
    const activePassives = this.abilities.filter(a => a.passivity == Passivity.PASSIVE && a.isAvailable())

    return activePassives.reduce((a, b) => a + b.damageBuff, 0)
  }
}
