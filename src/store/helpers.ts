import Player from "../models/Player"
import Tile from "../models/Tile"

export function getFighterOnTile(players: Player[], tile: Tile) {
  let fighter = undefined
  let playerIndex = 0

  while (fighter === undefined) {
    const player = players[playerIndex]

    if (!player) break

    fighter = player?.fighters.find(fighter => fighter.isOnTile(tile))

    playerIndex++
  }

  return fighter
}