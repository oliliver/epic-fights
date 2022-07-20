import Fighter, { Fighter1, Fighter2, Fighter3, Fighter4 } from './Fighter'
import Tile from './Tile'
import { nanoid } from 'nanoid'
import { PlayerColor } from './types'

export default class Player {
  public id: string
  public tiles: Tile[]
  public color: PlayerColor
  public fighters: Fighter[] = []

  constructor(initialData: { tiles: Tile[], color: PlayerColor }) {
    this.id = nanoid()
    this.color = initialData.color
    this.tiles = initialData.tiles

    this.fighters = [
      new Fighter1({ position: { row: this.tiles[0].row, col: this.tiles[0].col }, player: this }),
      new Fighter2({ position: { row: this.tiles[1].row, col: this.tiles[1].col }, player: this }),
      new Fighter3({ position: { row: this.tiles[2].row, col: this.tiles[2].col }, player: this }),
      new Fighter4({ position: { row: this.tiles[3].row, col: this.tiles[3].col }, player: this }),
    ]
  }
}