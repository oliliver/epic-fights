import Fighter from "../models/Fighter";
import { throwError } from "../store/helpers";
import { AbilityData, FighterData, Passivity, Rarity } from '../models/types'
import Tile from "../models/Tile";
import { PlayerType } from "../models/Player";

const basicAbilitiesData: AbilityData[] = [
  {
    name: 'Heal',
    icon: 'heart-plus',
    description: 'Heal a small amount of health',
    passivity: Passivity.ACTIVE,
    rarity: Rarity.BASIC,
    restoration: 2,
    usesTotal: Infinity,
    usesPerTurn: 1,
  },
  {
    name: 'Adrenaline Rush',
    damageBuff: 2,
    description: 'Damage boost that activates when a player has only one fighter alive',
    passivity: Passivity.PASSIVE,
    rarity: Rarity.BASIC,
    usesTotal: Infinity,
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
    range: 1,
  },
  {
    tier: 2,
    fighterId: 2,
    attackPoints: 4,
    movementPoints: 2,
    defensePoints: 0,
    range: 1,
    abilities: [
      {
        passivity: Passivity.ACTIVE,
        rarity: Rarity.SPECIAL,
        name: 'Fire Arrow',
        usesTotal: 1,
        damage: 8,
      }
    ]
  },
  {
    tier: 3,
    fighterId: 3,
    attackPoints: 4,
    movementPoints: 3,
    defensePoints: 1,
    range: 1,
  },
  {
    tier: 4,
    fighterId: 4,
    attackPoints: 4,
    movementPoints: 4,
    defensePoints: 2,
    range: 1,
  }
]

class FighterService {
  public createFighter(args: { fighterId: number, startingTile?: Tile, player?: PlayerType }) {
    const { fighterId, startingTile, player } = args
    const recipe = fighterRecipies.find(r => r.fighterId == fighterId)

    if (!recipe) {
      throwError('RECIPE_NOT_FOUND', 'FighterService.createFighter')
    }

    const fighterData = {
      ...recipe,
      abilities: [
        ...(recipe.abilities ?? []),
        ...basicAbilitiesData,
      ]
    }

    return new Fighter({ ...fighterData, startingTile, player })
  }
}

export default new FighterService()