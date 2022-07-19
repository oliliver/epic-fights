import Player from '../models/Player'
import { tiles } from "./tiles";

const player1 = new Player({
  tiles: tiles.filter(tile => !tile.isCornerTile && tile.isInFirstRow),
  color: 'blue',
})
const player2 = new Player({
  tiles: tiles.filter(tile => !tile.isCornerTile && tile.isInLastRow),
  color: 'green',
})
const player3 = new Player({
  tiles: tiles.filter(tile => !tile.isCornerTile && tile.isInFirstCol),
  color: 'yellow',
})
const player4 = new Player({
  tiles: tiles.filter(tile => !tile.isCornerTile && tile.isInLastCol),
  color: 'red',
})

const players = [
  player1,
  player2,
  player3,
  player4,
]

export { players }