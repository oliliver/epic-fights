<template>
  <div class="shadow-inner rounded-full h-full w-full relative group select-none" :class="
    !isSelectedAttack && ability && ability.isAvailable() && 'border peer border-gray-200 hover:opacity-80 hover:border-emerald-500 cursor-pointer',
    ability && !ability.isAvailable() && 'opacity-50'
  ">
    <div class="h-full w-full rounded-full" :class="isSelectedAttack ? 'p-[2px]' : 'p-[2px] sm:p-1'"
      :style="{ backgroundColor: isSelectedAttack ? player.colorValue(200) : 'rgb(55 65 81)' }">
      <div class=" h-full w-full rounded-full flex"
        :style="{ backgroundColor: isSelectedAttack ? player?.colorValue() : 'rgb(17 24 39)' }">
        <img v-if="iconPath"
          :class="!isSelectedAttack && ability?.isAvailable() && ability?.abilityTypes.includes(AbilityType.ATTACK_REPLACEMENT) && 'group-hover:opacity-20', ability?.isAvailable() && !ability?.abilityTypes.includes(AbilityType.ATTACK_REPLACEMENT) && 'text-green-500'"
          class="m-auto h-3/5 w-3/5 select-none" :src="iconPath"
          :style="{ filter: `brightness(0) invert(${isSelectedAttack ? 0 : 1})` }" @contextmenu="() => false" />
      </div>
    </div>
    <svg v-if="!isSelectedAttack"
      class="bg-black bg-opacity-20 opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current text-white h-3/5 w-3/5"
      :class="ability?.isAvailable() && 'group-hover:opacity-100'" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24">
      <path v-if="ability?.abilityTypes.includes(AbilityType.ATTACK_REPLACEMENT)"
        d="M14.2929 2.29289C14.6834 1.90237 15.3166 1.90237 15.7071 2.29289L19.7071 6.29289C20.0976 6.68342 20.0976 7.31658 19.7071 7.70711L15.7071 11.7071C15.3166 12.0976 14.6834 12.0976 14.2929 11.7071C13.9024 11.3166 13.9024 10.6834 14.2929 10.2929L16.5858 8L5 8C4.44772 8 4 7.55228 4 7C4 6.44771 4.44772 6 5 6L16.5858 6L14.2929 3.70711C13.9024 3.31658 13.9024 2.68342 14.2929 2.29289ZM9.70711 12.2929C10.0976 12.6834 10.0976 13.3166 9.70711 13.7071L7.41421 16H19C19.5523 16 20 16.4477 20 17C20 17.5523 19.5523 18 19 18H7.41421L9.70711 20.2929C10.0976 20.6834 10.0976 21.3166 9.70711 21.7071C9.31658 22.0976 8.68342 22.0976 8.29289 21.7071L4.29289 17.7071C4.10536 17.5196 4 17.2652 4 17C4 16.7348 4.10536 16.4804 4.29289 16.2929L8.29289 12.2929C8.68342 11.9024 9.31658 11.9024 9.70711 12.2929Z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { neutralPlayer } from '../models/Player';
import { useGameStore, useBoardStore } from "../store";
import { TAbility, AbilityType } from "../models/types";

const props = defineProps<{
  ability: TAbility,
}>()

const gameStore = useGameStore()
const boardStore = useBoardStore()

const player = computed(() => gameStore.activePlayer || neutralPlayer)

const iconPath = ref('')
async function updateIconPath(newPath: string) {
  iconPath.value = (await import(`../assets/icons/${newPath}.svg`))?.default
}
watch(() => props.ability.icon, () => updateIconPath(props.ability.icon), { immediate: true })

const isSelectedAttack = computed(() => boardStore.selectedPawn?.fighter.currentAbility.id == props.ability.id)
</script>