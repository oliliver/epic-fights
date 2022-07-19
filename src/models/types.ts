import Ability from "../models/Ability";

/** starting on 1 / 1 */
export type GridPosition = { row: number, col: number }

export type PlayerColor = 'blue' | 'green' | 'red' | 'yellow'

export type FighterData = {
  tier: number,
  attackPoints: number,
  movementPoints: number,
  defensePoints: number,
  abilities?: {
    [name: string]: Ability
  }
}