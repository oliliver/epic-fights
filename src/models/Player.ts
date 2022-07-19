import Fighter, { Fighter1, Fighter2, Fighter3, Fighter4 } from './Fighter'
import Tile from './Tile'
import { PlayerColor } from './types'

export default class Player {
  tiles: Tile[]
  color: PlayerColor
  fighters: Fighter[] = []

  constructor(initialData: { tiles: Tile[], color: PlayerColor }) {
    this.tiles = initialData.tiles
    this.color = initialData.color
    this.fighters = [
      new Fighter1({ row: this.tiles[0].row, col: this.tiles[0].col }),
      new Fighter2({ row: this.tiles[1].row, col: this.tiles[1].col }),
      new Fighter3({ row: this.tiles[2].row, col: this.tiles[2].col }),
      new Fighter4({ row: this.tiles[3].row, col: this.tiles[3].col }),
    ]
  }
}