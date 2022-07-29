import { defineStore } from 'pinia'
import { MainState, MenuName } from './types'
import { useGameStore } from './gameStore';
import { useStorage } from '@vueuse/core'
import { Menu } from '../models/Menu';

export * from "./gameStore";
export * from "./boardStore";

new Menu({
  name: MenuName.MAIN_MENU, children: [
    { name: MenuName.SETTINGS },
    { name: MenuName.NEW_GAME },
  ]
})

export const useStore = defineStore('main', {
  state(): MainState {
    return {
      activeMenu: MenuName.null,
      initialized: false,
      menues: Menu.allMenues,
      settings: useStorage('settings', {
        useSplashScreen: true,
      })
    }
  },
  actions: {
    initializeStore() {
      const gameStore = useGameStore()

      gameStore.initializeGameStore()

      this.initialized = true
    },
    setActiveMenu(newActiveMenu: MenuName) {
      this.activeMenu = newActiveMenu

      if (newActiveMenu == MenuName.NEW_GAME) {
        const gameStore = useGameStore()
        gameStore.setupNewGame()
      }
    },
  },
})