import Fighter from "../models/Fighter";
import { throwError } from "../store/helpers";
import { AbilityData, AbilityType, FighterData, Passivity, Rarity, Target, TTile } from '../models/types'
import { TPlayer } from "../models/Player";

const basicAbilitiesData: AbilityData[] = [
  {
    abilityTypes: [AbilityType.ATTACK_REPLACEMENT],
    description: 'Basic attack',
    name: 'Attack',
    icon: 'sword',
    passivity: Passivity.ACTIVE,
    range: 1,
    rarity: Rarity.BASIC,
    damageBuff: 0,
    usesPerTurn: 1,
    usesTotal: Infinity,
    target: Target.ENEMY,
  },
  {
    abilityTypes: [AbilityType.HEAL],
    name: 'Heal',
    icon: 'heart-plus',
    description: 'Heal a small amount of health',
    passivity: Passivity.ACTIVE,
    range: 1,
    rarity: Rarity.COMMON,
    restoration: 2,
    usesTotal: Infinity,
    usesPerTurn: 1,
    conditions: [
      (fighter: Fighter) => fighter.healthPoints < fighter.healthPointsMax,
    ],
    target: Target.SELF,
  },
  {
    abilityTypes: [AbilityType.BUFF],
    name: 'Adrenaline Rush',
    damageBuff: 2,
    description: 'Damage boost that activates when a player has only one fighter alive',
    passivity: Passivity.PASSIVE,
    range: 1,
    rarity: Rarity.COMMON,
    usesTotal: Infinity,
    target: Target.SELF,
    conditions: [
      (fighter: Fighter) => fighter.isAlive && fighter.player.fighters.filter(f => f.isAlive).length == 1
    ]
  }
]

export const fighterRecipies: FighterData[] = [
  {
    tier: 1,
    fighterId: 1,
    attackPoints: 3,
    movementPoints: 1,
    defensePoints: 3,
  },
  {
    tier: 2,
    fighterId: 2,
    attackPoints: 4,
    movementPoints: 2,
    defensePoints: 0,
    abilities: [
      {
        abilityTypes: [AbilityType.ATTACK_REPLACEMENT],
        damageBuff: 4,
        description: 'Extra powerful attack',
        icon: 'flaming-arrow',
        name: 'Fire Arrow',
        passivity: Passivity.ACTIVE,
        range: 1,
        rarity: Rarity.SPECIAL,
        usesTotal: 1,
        target: Target.ENEMY,
      }
    ]
  },
  {
    tier: 3,
    fighterId: 3,
    attackPoints: 4,
    movementPoints: 3,
    defensePoints: 1,
  },
  {
    tier: 4,
    fighterId: 4,
    attackPoints: 4,
    movementPoints: 4,
    defensePoints: 2,
  }
]

class FighterService {
  public createFighter(args: { fighterId: number, startingTile?: TTile, player?: TPlayer }) {
    const { fighterId, startingTile, player } = args
    const recipe = fighterRecipies.find(r => r.fighterId == fighterId)

    if (!recipe) {
      throwError('RECIPE_NOT_FOUND', 'FighterService.createFighter')
    }

    const fighterData = {
      ...recipe,
      abilities: [
        ...basicAbilitiesData,
        ...(recipe.abilities ?? []),
      ]
    }

    return new Fighter({ ...fighterData, startingTile, player })
  }
}

export default new FighterService()