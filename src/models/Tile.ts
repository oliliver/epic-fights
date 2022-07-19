import constants from "../constants"

const { GRID_HEIGHT, GRID_WIDTH } = constants

export default class Tile {
  public isCornerTile: boolean
  public isInFirstRow: boolean
  public isInFirstCol: boolean
  public isInLastRow: boolean
  public isInLastCol: boolean

  constructor(public id: number, public row: number, public col: number) {
    this.isCornerTile = [1, GRID_HEIGHT].includes(row) && [1, GRID_WIDTH].includes(col)
    this.isInFirstRow = row == 1
    this.isInFirstCol = col == 1
    this.isInLastRow = row == GRID_HEIGHT
    this.isInLastCol = col == GRID_WIDTH

    Object.freeze(this)
  }
}