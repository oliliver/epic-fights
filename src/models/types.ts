import Ability from "../models/Ability";
import Fighter from "./Fighter";
import Tile from "./Tile";

/** starting on 1 / 1 */
export type GridPosition = { row: number, col: number }

export type PlayerColor = 'blue' | 'green' | 'red' | 'yellow' | 'gray'

export type AbilityData = {
  damage?: number,
  damageBuff?: number,
  description?: string,
  icon?: string
  passivity: Passivity,
  rarity: Rarity,
  restoration?: number,
  name: string,
  usesTotal?: number,
  usesPerTurn?: number
  conditions?: [(fighter: Fighter) => boolean]
}

export type FighterData = {
  tier: number,
  fighterId: number,
  attackPoints: number,
  movementPoints: number,
  defensePoints: number,
  range: number,
  abilities?: AbilityData[]
}

export type Public<T> = { [P in keyof T]: T[P] }

export type AbilityType = Public<Ability>

export type ReachableTile = (Tile & {
  numberOfStepsAway?: number
})

export enum Rarity {
  BASIC = 'BASIC',
  SPECIAL = 'SPECIAL'

}
export enum Passivity {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE'
}