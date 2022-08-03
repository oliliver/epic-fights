import Fighter from "../models/Fighter"
import Tile from "../models/Tile"
import { PlayerType } from "../models/Player"
import { ReachableTile } from "../models/types"
import { ColorName } from "../constants"
import { RemovableRef } from "@vueuse/core"
import { Menu } from "../models/Menu"

export enum MenuName {
  MAIN_MENU = 'MAIN_MENU',
  NEW_GAME = 'NEW_GAME',
  SETTINGS = 'SETTINGS',
  null = 'null'
}

export type GroupedPositionBoolean = {
  [col: string]: {
    [row: string]: boolean
  }
}

export type PlayerSlot = {
  defaultColor: ColorName
  tiles: Tile[]
}

export type FighterInPool = {
  fighter: Fighter
  maxCount: number
}

export type MenuCreateInput = { name: MenuName, parent?: Menu, children?: MenuCreateInput[] }

export type MainState = {
  initialized: boolean
  activeMenu: MenuName
  menues: Menu[]
  settings: RemovableRef<{
    useSplashScreen: boolean
  }>
}

export type BoardState = {
  selectedPawn: {
    fighter: Fighter,
    tile: Tile
    player: PlayerType
  } | null
  reachableTiles: ReachableTile[]
  reachableTilesKeyedById: { [id: string | number]: ReachableTile }
  showAbilityOverlay: boolean
}

type AvailableAction = {
  isUsed: boolean
  isAllowed: () => boolean
  isPossible: () => boolean
}

export enum PlayerAction {
  attack = 'attack',
  movement = 'movement',
}

type ActivePlayerState = {
  id: string | null
  selectedAction: any | null
  availableActions: {
    [action in PlayerAction]: AvailableAction
  }
}

export type GameState = {
  activePlayer: PlayerType | null
  activePlayerData: ActivePlayerState
  currentTurn: {
    number: number
  }
  players: PlayerType[]
  randomizedTurnOrderOffset: number
  static: {
    fighterPool: FighterInPool[]
    tiles: Tile[]
    playerSlots: PlayerSlot[]
  }
  winner: PlayerType | null
}