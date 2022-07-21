import constants from "../constants"
import { useStore } from "../store";

const { GRID_HEIGHT, GRID_WIDTH } = constants

export default class Tile {
  readonly col: number
  readonly id: number
  readonly isCornerTile: boolean
  readonly isEdgeTile: boolean
  readonly isInFirstCol: boolean
  readonly isInFirstRow: boolean
  readonly isInLastCol: boolean
  readonly isInLastRow: boolean
  readonly row: number

  readonly isOccupied: () => boolean

  public classes: string[] = []

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

    if (this.isCornerTile) {
      this.classes = ['bg-transparent']
    } else if (!this.isEdgeTile) {
      this.classes = ['bg-gray-200']
    }

    Object.seal(this)
  }
}