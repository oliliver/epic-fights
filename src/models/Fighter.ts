import Ability from './Ability'
import constants from '../constants'
import Tile from './Tile'
import { PlayerClass } from './Player'
import { FighterData, GridPosition } from './types'
import { nanoid } from 'nanoid'

export const fighterData = {
  1: {
    tier: 1,
    attackPoints: 3,
    movementPoints: 1,
    defensePoints: 3, //?,
  },
  2: {
    tier: 2,
    attackPoints: 4,
    movementPoints: 2,
    defensePoints: 2, //?
    abilities: {
      superPunch: new Ability({
        uses: 1,
        damage: 8,
      })
    },
  },
  3: {
    tier: 3,
    attackPoints: 4,
    movementPoints: 3,
    defensePoints: 1, //?
  },
  4: {
    tier: 4,
    attackPoints: 4,
    movementPoints: 4,
    defensePoints: 0, //?
  }
}

export default class Fighter {
  public abilities: { [name: string]: Ability }
  public attackPoints: number
  public defensePoints: number
  public healthPoints: number
  public id: string
  public movementPoints: number
  public player: PlayerClass
  public position: GridPosition
  public tier: number

  readonly startingTile: Tile

  constructor(initialData: FighterData & {
    startingTile: Tile
    player: PlayerClass
  }) {
    this.abilities = initialData.abilities ?? {}
    this.attackPoints = initialData.attackPoints
    this.defensePoints = initialData.defensePoints
    this.healthPoints = constants.DEFAULT_HP
    this.id = nanoid()
    this.movementPoints = initialData.movementPoints
    this.player = initialData.player
    this.position = { row: initialData.startingTile.row, col: initialData.startingTile.col }
    this.startingTile = initialData.startingTile
    this.tier = initialData.tier
  }

  /**
   * isOnTile
   * @param tile: Tile
   * @returns boolean
   */
  public isOnTile(tile: Tile) {
    return tile.row == this.position.row && tile.col == this.position.col
  }
}

export class Fighter1 extends Fighter {
  constructor(args: { startingTile: Tile, player: PlayerClass }) {
    const { startingTile, player } = args

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
  constructor(args: { startingTile: Tile, player: PlayerClass }) {
    const { startingTile, player } = args

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
  constructor(args: { startingTile: Tile, player: PlayerClass }) {
    const { startingTile, player } = args

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
  constructor(args: { startingTile: Tile, player: PlayerClass }) {
    const { startingTile, player } = args

    super(
      {
        ...fighterData[4],
        startingTile,
        player,
      }
    )
  }
}
