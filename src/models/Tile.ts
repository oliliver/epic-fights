import constants from "../constants"
import { useStore } from "../store";

const { GRID_HEIGHT, GRID_WIDTH } = constants

export default class Tile {
  public col: number
  public id: number
  public isCornerTile: boolean
  public isEdgeTile: boolean
  public isInFirstCol: boolean
  public isInFirstRow: boolean
  public isInLastCol: boolean
  public isInLastRow: boolean
  public row: number

  readonly isOccupied: () => boolean

  constructor(id: number, row: number, col: number) {
    this.isOccupied = () => {
      const store = useStore()

      return Object.keys(store.fightersOnTiles).filter(key => store.fightersOnTiles[key]).some(tileId => tileId == String(this.id))
    }

    this.col = col
    this.id = id
    this.isCornerTile = [1, GRID_HEIGHT].includes(row) && [1, GRID_WIDTH].includes(col)
    this.isInFirstCol = col == 1
    this.isInFirstRow = row == 1
    this.isInLastCol = col == GRID_WIDTH
    this.isInLastRow = row == GRID_HEIGHT
    this.isEdgeTile = this.isInFirstCol || this.isInFirstRow || this.isInLastCol || this.isInLastRow
    this.row = row

    Object.freeze(this)
  }
}