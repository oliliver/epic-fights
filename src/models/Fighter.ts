import Ability from './Ability'
import cloneDeep from 'lodash/fp/cloneDeep'
import constants from '../constants'
import { FighterData, GridPosition } from './types'
import Tile from './Tile'
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
  public id: string
  public healthPoints: number
  public attackPoints: number
  public defensePoints: number
  public movementPoints: number
  public tier: number
  public position: GridPosition
  public abilities: {
    [name: string]: Ability
  }


  constructor(initialData: FighterData & {
    position: GridPosition
  }) {
    this.healthPoints = constants.DEFAULT_HP
    this.attackPoints = initialData.attackPoints
    this.movementPoints = initialData.movementPoints
    this.defensePoints = initialData.defensePoints
    this.tier = initialData.tier
    this.abilities = cloneDeep(initialData.abilities ?? {})
    this.position = cloneDeep(initialData.position)
    this.id = nanoid()
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
  constructor(position: GridPosition) {
    super(
      {
        ...fighterData[1],
        position,
      }
    )
  }
}

export class Fighter2 extends Fighter {
  constructor(position: GridPosition) {
    super(
      {
        ...fighterData[2],
        position,
      }
    )
  }
}

export class Fighter3 extends Fighter {
  constructor(position: GridPosition) {
    super(
      {
        ...fighterData[3],
        position,
      }
    )
  }
}

export class Fighter4 extends Fighter {
  constructor(position: GridPosition) {
    super(
      {
        ...fighterData[4],
        position,
      }
    )
  }
}
