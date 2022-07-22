import Fighter from "../models/Fighter"
import Tile from "../models/Tile"
import { PlayerClass } from "../models/Player"
import { ReachableTile } from "../models/types"

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
  reachableTiles: ReachableTile[]
  players: PlayerClass[]
}