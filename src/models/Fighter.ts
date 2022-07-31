import Ability from './Ability'
import constants from '../constants'
import Tile, { neutralTile } from './Tile'
import { PlayerClass, neutralPlayer } from './Player'
import { FighterData } from './types'
import { nanoid } from 'nanoid'
import { useGameStore } from '../store'
import { PlayerAction } from '../store/types'
import { getOrthogonallyDiagonalTiles } from '../store/helpers'

export const fighterData: { [key: number | string]: FighterData } = {
  1: {
    tier: 1,
    fighterId: 1,
    attackPoints: 3,
    movementPoints: 1,
    defensePoints: 3,
    range: 1,
  },
  2: {
    tier: 2,
    fighterId: 2,
    attackPoints: 4,
    movementPoints: 2,
    defensePoints: 0,
    range: 1,
    abilities: {
      fireArrow: new Ability({
        name: 'Fire arrow',
        uses: 1,
        damage: 8,
      })
    },
  },
  3: {
    tier: 3,
    fighterId: 3,
    attackPoints: 4,
    movementPoints: 3,
    defensePoints: 1,
    range: 1,
  },
  4: {
    tier: 4,
    fighterId: 4,
    attackPoints: 4,
    movementPoints: 4,
    defensePoints: 2,
    range: 1,
  }
}

export default class Fighter {
  public healthPoints: number
  public isAlive = true
  public player: PlayerClass
  public currentTile: Tile

  readonly abilities: { [name: string]: Ability }
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
    player?: PlayerClass
  }) {
    this.abilities = initialData.abilities ?? {}
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
    if (options.isAnAction && !this.player.canPerformAction(PlayerAction.movement)) return

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
}

export class Fighter1 extends Fighter {
  constructor(args?: { startingTile?: Tile, player?: PlayerClass }) {
    const { startingTile, player } = args ?? {}

    super(
      {
        ...fighterData[1],
        startingTile,
        player,
      }
    )
  }
}

export class Fighter2 extends Fighter {
  constructor(args?: { startingTile?: Tile, player?: PlayerClass }) {
    const { startingTile, player } = args ?? {}

    super(
      {
        ...fighterData[2],
        startingTile,
        player,
      }
    )
  }
}

export class Fighter3 extends Fighter {
  constructor(args?: { startingTile?: Tile, player?: PlayerClass }) {
    const { startingTile, player } = args ?? {}

    super(
      {
        ...fighterData[3],
        startingTile,
        player,
      }
    )
  }
}

export class Fighter4 extends Fighter {
  constructor(args?: { startingTile?: Tile, player?: PlayerClass }) {
    const { startingTile, player } = args ?? {}

    super(
      {
        ...fighterData[4],
        startingTile,
        player,
      }
    )
  }
}
