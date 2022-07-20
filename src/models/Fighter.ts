import Ability from './Ability'
import cloneDeep from 'lodash/fp/cloneDeep'
import constants from '../constants'
import { FighterData, GridPosition } from './types'
import Tile from './Tile'
import { nanoid } from 'nanoid'
import Player from './Player'

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
  public player: Player
  public position: GridPosition
  public tier: number


  constructor(initialData: FighterData & {
    position: GridPosition
    player: Player
  }) {
    this.abilities = cloneDeep(initialData.abilities ?? {})
    this.attackPoints = initialData.attackPoints
    this.defensePoints = initialData.defensePoints
    this.healthPoints = constants.DEFAULT_HP
    this.id = nanoid()
    this.movementPoints = initialData.movementPoints
    this.player = initialData.player
    this.position = cloneDeep(initialData.position)
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
  constructor(args: { position: GridPosition, player: Player }) {
    const { position, player } = args

    super(
      {
        ...fighterData[1],
        position,
        player,
      }
    )
  }
}

export class Fighter2 extends Fighter {
  constructor(args: { position: GridPosition, player: Player }) {
    const { position, player } = args

    super(
      {
        ...fighterData[2],
        position,
        player,
      }
    )
  }
}

export class Fighter3 extends Fighter {
  constructor(args: { position: GridPosition, player: Player }) {
    const { position, player } = args

    super(
      {
        ...fighterData[3],
        position,
        player,
      }
    )
  }
}

export class Fighter4 extends Fighter {
  constructor(args: { position: GridPosition, player: Player }) {
    const { position, player } = args

    super(
      {
        ...fighterData[4],
        position,
        player,
      }
    )
  }
}
