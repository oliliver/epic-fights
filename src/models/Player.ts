import constants from '../constants'
import Fighter, { Fighter1, Fighter2, Fighter3, Fighter4 } from './Fighter'
import Tile from './Tile'
import { nanoid } from 'nanoid'
import { PlayerColor, Public } from './types'

export default class Player {
  public id: string
  public tiles: Tile[]
  public color: PlayerColor
  public fighters: Fighter[] = []

  constructor(initialData: { tiles: Tile[], color: PlayerColor }) {
    this.id = nanoid()
    this.color = initialData.color
    this.tiles = initialData.tiles

    this.assignFighters()
    this.assignTileColors()
  }

  private assignTileColors() {
    this.tiles.forEach(tile => {
      tile.classes = [constants.colors.bg[this.color]]
    })
  }

  private assignFighters() {
    this.fighters = [
      new Fighter1({ startingTile: this.tiles[0], player: this }),
      new Fighter2({ startingTile: this.tiles[1], player: this }),
      new Fighter3({ startingTile: this.tiles[2], player: this }),
      new Fighter4({ startingTile: this.tiles[3], player: this }),
    ]
  }
}

export type PlayerClass = Public<Player>