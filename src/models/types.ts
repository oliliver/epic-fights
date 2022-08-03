import Ability from "../models/Ability";
import Fighter from "./Fighter";
import Tile from "./Tile";

/** starting on 1 / 1 */
export type GridPosition = { row: number, col: number }

export enum AbilityType {
  HEAL = 'HEAL',
  ATTACK_REPLACEMENT = 'ATTACK_REPLACEMENT',
  BUFF = 'BUFF'
}

export type AbilityData = {
  abilityTypes: AbilityType[],
  conditions?: [(fighter: Fighter) => boolean]
  damage?: number,
  damageBuff?: number,
  description?: string,
  icon?: string
  name: string,
  passivity: Passivity,
  range: number,
  rarity: Rarity,
  restoration?: number,
  target: Target,
  usesPerTurn?: number
  usesTotal?: number,
}

export type FighterData = {
  tier: number,
  fighterId: number,
  attackPoints: number,
  movementPoints: number,
  defensePoints: number,
  abilities?: AbilityData[]
}

export type Public<T> = { [P in keyof T]: T[P] }

export type TAbility = Public<Ability>

export type ReachableTile = (Tile & {
  numberOfStepsAway?: number
})

export enum Rarity {
  BASIC = 'BASIC',
  COMMON = 'COMMON',
  SPECIAL = 'SPECIAL'

}
export enum Passivity {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE'
}

export enum Target {
  SELF = 'SELF',
  ALLY = 'ALLY',
  ENEMY = 'ENEMY',
}