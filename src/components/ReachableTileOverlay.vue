<template>
  <transition name="fade" appear>
    <div @click="movePawn" class="p-2 cursor-pointer z-20 bg-gray-200 grid group opacity-30"
      :style="{ transitionDelay: `${(tile.numberOfStepsAway ?? 1) * 50}ms` }" :key="store.selectedPawnId">
      <div
        class="bg-white h-1/2 w-1/2 m-auto opacity-0 shadow-inner group-hover:opacity-40 rounded-full col-start-1 row-start-1" />
      <div :class="playerColor" class="rounded-lg  h-full w-full col-start-1 row-start-1" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import constants from '../constants';
import { computed, onMounted, ref } from 'vue';
import { ReachableTile } from '../models/types'
import { useStore } from "../store";

const props = defineProps<{ tile: ReachableTile }>()
const store = useStore()

function movePawn() {
  store.movePawn(props.tile)
}

const isMounted = ref(false)
onMounted(() => {
  setTimeout(() => isMounted.value = true, 0)
})

const playerColor = computed(() => store.selectedPawn ? constants.colors.bg[store.selectedPawn?.fighter.player.color] : '')

</script>

<style>
.fade-enter-to,
.fade-leave-from {
  opacity: .3;
}

.fade-enter-active {
  transition: opacity 300ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>