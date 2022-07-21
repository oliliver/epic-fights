import Fighter from "../models/Fighter"
import Player from "../models/Player"
import Tile from "../models/Tile"

export type GroupedPositionBoolean = {
  [col: string]: {
    [row: string]: boolean
  }
}

export type MainStoreData = {
  selectedPawn: {
    fighter: Fighter,
    tile: Tile
  } | null
  tiles: Tile[]
  reachableTiles: Tile[]
  // reachablePositions: {
  //   [col: number | string]: {
  //     min: number,
  //     max: number
  //   }
  // }
  players: Player[]
}