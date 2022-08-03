import { nanoid } from "nanoid"
import { throwError } from "../store/helpers"
import Fighter from "./Fighter"
import { AbilityData, Rarity, Passivity } from "./types"

export default class Ability {
  public damage: number
  public damageBuff: number
  public description: string
  public id: string
  public icon: string
  public rarity: Rarity
  public restoration: number
  public passivity: Passivity
  public name: string
  public usesTotal: number
  public usesPerTurn: number
  public usesLeftTotal: number
  public usesLeftThisTurn: number

  private conditions: Array<(fighter: Fighter) => boolean>
  private fighter: Fighter | null

  constructor(initialData: AbilityData, fighter?: Fighter) {
    this.fighter = fighter ?? null
    this.conditions = initialData.conditions ?? []
    this.damage = initialData.damage ?? 0
    this.damageBuff = initialData.damageBuff ?? 0
    this.description = initialData.description ?? ''
    this.id = nanoid()
    this.icon = initialData.icon ?? 'sword'
    this.passivity = initialData.passivity
    this.rarity = initialData.rarity
    this.restoration = initialData.restoration
    this.name = initialData.name
    this.usesTotal = initialData.usesTotal ?? Infinity
    this.usesPerTurn = initialData.usesPerTurn ?? this.usesTotal
    this.usesLeftTotal = this.usesTotal
    this.usesLeftThisTurn = this.usesPerTurn
  }

  public isAvailable() {
    if (this.fighter !== null) {
      const fighter = this.fighter as Fighter
      return this.conditions.every(v => v(fighter))
    }
    return false
  }

  public spendAction() {
    if (this.usesLeftThisTurn < 1) {
      throwError('NO_MORE_USES_THIS_TURN', 'Ability.spendAction')
    }
    if (this.usesLeftTotal < 1) {
      throwError('NO_MORE_USES', 'Ability.spendAction')
    }

    this.usesLeftTotal--
    this.usesLeftThisTurn--
  }

  private resetUsesLeftThisTurn() {
    this.usesLeftThisTurn = Math.min(this.usesPerTurn, this.usesLeftTotal)
  }

  public doNewTurnUpkeep() {
    this.resetUsesLeftThisTurn()
  }
}
