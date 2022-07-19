import constants from "../constants";
import Tile from '../models/Tile'

const { GRID_HEIGHT, GRID_WIDTH } = constants

const tiles: Tile[] = []
let tileId = 0

for (let row = 1; row <= GRID_HEIGHT; row++) {
  for (let col = 1; col <= GRID_WIDTH; col++) {
    tiles.push(new Tile(tileId++, row, col))
  }
}

export { tiles }