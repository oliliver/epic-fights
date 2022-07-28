<template>
  <div v-if="store.activeMenu == props.menuName" class="menu-body gap-1">
    <div class="flex items-center">
      <div class="w-1/2 shrink flex">
        <button @click="goBack" v-if="currentMenu?.parent"
          class="text-xl -ml-[2px] mr-auto leading-none self-center py-[2px] px-[2px] rounded cursor-pointer hover:bg-gray-200 transition-colors">
          <svg class="fill-current text-gray-900" viewBox="0 0 24 24" height="18" width="18"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.7071 5.29289C12.0976 5.68342 12.0976 6.31658 11.7071 6.70711L7.41421 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H7.41421L11.7071 17.2929C12.0976 17.6834 12.0976 18.3166 11.7071 18.7071C11.3166 19.0976 10.6834 19.0976 10.2929 18.7071L4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929L10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289Z" />
          </svg>
        </button>
      </div>
      <h1 v-if="heading" class="font-bold w-full">{{ heading }}</h1>
      <div class="w-1/2 shrink flex">
        <button @click="store.setActiveMenu(MenuName.null)"
          class="text-xl ml-auto leading-none self-center pb-1 px-[5px] -mr-1 rounded cursor-pointer hover:bg-gray-200 transition-colors text-gray-900">
          &times;
        </button>
      </div>
    </div>
    <hr class="pb-2" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useStore } from '../../store'
import { MenuName } from "../../store/types";

const store = useStore()

const props = defineProps<{
  heading: string
  menuName: MenuName
}>()

const currentMenu = computed(() => store.menues.find(m => m.name == props.menuName))

function goBack() {
  store.setActiveMenu(currentMenu.value?.parent?.name ?? MenuName.null)
}
</script>