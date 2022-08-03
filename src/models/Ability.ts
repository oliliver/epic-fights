import Fighter from "./Fighter"
import { nanoid } from "nanoid"
import { useGameStore } from "../store"
import { throwError } from "../store/helpers"
import { PlayerAction } from "../store/types"
import { AbilityData, Target, AbilityType, Rarity, Passivity } from "./types"

export default class Ability {
  public abilityTypes: AbilityType[]
  public damage: number
  public damageBuff: number
  public description: string
  public id: string
  public icon: string
  public range: number
  public rarity: Rarity
  public restoration: number
  public passivity: Passivity
  public name: string
  public target: Target
  public usesTotal: number
  public usesPerTurn: number
  public usesLeftTotal: number
  public usesLeftThisTurn: number
  public indexOnFighter: number

  private conditions: Array<(fighter: Fighter) => boolean>
  private fighter: Fighter | null

  constructor(initialData: AbilityData & { indexOnFighter: number }, fighter?: Fighter) {
    this.abilityTypes = initialData.abilityTypes
    this.fighter = fighter ?? null
    this.conditions = initialData.conditions ?? []
    this.damage = initialData.damage ?? 0
    this.damageBuff = initialData.damageBuff ?? 0
    this.description = initialData.description ?? ''
    this.id = nanoid()
    this.icon = initialData.icon ?? 'sword'
    this.indexOnFighter = initialData.indexOnFighter
    this.passivity = initialData.passivity
    this.range = initialData.range
    this.rarity = initialData.rarity
    this.restoration = initialData.restoration ?? 0
    this.name = initialData.name
    this.target = initialData.target
    this.usesTotal = initialData.usesTotal ?? Infinity
    this.usesPerTurn = initialData.usesPerTurn ?? this.usesTotal
    this.usesLeftTotal = this.usesTotal
    this.usesLeftThisTurn = this.usesPerTurn
  }

  private getFighter(): Fighter {
    if (!this.fighter) throwError('NO_FIGHTER_ON_ABILITY', 'Ability.getFighter')

    return this.fighter
  }

  public isAvailable() {
    if (!this.usesLeftThisTurn || !this.usesLeftTotal) {
      return false
    }

    const fighter = this.getFighter()
    return this.conditions.every(v => v(fighter))
  }

  public isPossible() {
    if (!this.isAvailable()) return false

    let isPossible = true

    const fighter = this.getFighter()

    if (this.abilityTypes.includes(AbilityType.HEAL) && this.target == Target.SELF) {
      if (fighter.healthPoints >= fighter.healthPointsMax) {
        isPossible = false
      }
    }

    if (this.abilityTypes.includes(AbilityType.ATTACK_REPLACEMENT) && this.passivity == Passivity.ACTIVE) {
      isPossible = fighter.hasEnemyWithinAttackRange()
    }

    return isPossible
  }

  public expendUse() {
    const gameStore = useGameStore()

    if (this.usesLeftThisTurn < 1) {
      throwError('NO_MORE_USES_THIS_TURN', 'Ability.spendAction')
    }
    if (this.usesLeftTotal < 1) {
      throwError('NO_MORE_USES', 'Ability.spendAction')
    }

    this.usesLeftTotal--
    this.usesLeftThisTurn--

    gameStore.spendAction(PlayerAction.ability)
  }

  private resetUsesLeftThisTurn() {
    this.usesLeftThisTurn = Math.min(this.usesPerTurn, this.usesLeftTotal)
  }

  public doNewTurnUpkeep() {
    this.resetUsesLeftThisTurn()
  }
}
