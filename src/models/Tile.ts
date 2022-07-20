import constants from "../constants"
import { useStore } from "../store";

const { GRID_HEIGHT, GRID_WIDTH } = constants

export default class Tile {
  public belongsToOtherPlayer: () => boolean
  public col: number
  public id: number
  public isCornerTile: boolean
  public isInFirstCol: boolean
  public isInFirstRow: boolean
  public isInLastCol: boolean
  public isInLastRow: boolean
  public row: number

  constructor(id: number, row: number, col: number) {
    this.belongsToOtherPlayer = () => {
      const store = useStore()
      const currentPlayer = store.selectedPawn?.fighter?.player
      const otherPlayers = store.players.filter(player => player.id !== currentPlayer?.id)

      return otherPlayers.some(player => player.tiles?.includes(this))
    }

    this.col = col
    this.id = id
    this.isCornerTile = [1, GRID_HEIGHT].includes(row) && [1, GRID_WIDTH].includes(col)
    this.isInFirstCol = col == 1
    this.isInFirstRow = row == 1
    this.isInLastCol = col == GRID_WIDTH
    this.isInLastRow = row == GRID_HEIGHT
    this.row = row

    Object.freeze(this)
  }
}