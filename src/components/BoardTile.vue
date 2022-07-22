<template>
  <div class="group relative flex-none" :class="tile.classes, store.selectedPawn?.tile.id == tile.id && 'bg-opacity-90'"
    :key="tile.id">
    <div v-if="!tile.isCornerTile" class="flex flex-col h-full w-full">
      <FighterPawn v-if="fighterOnThisTile" :fighter="fighterOnThisTile" :tile="tile" class="relative z-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FighterPawn from "../components/FighterPawn.vue";
import Tile from '../models/Tile';
import Fighter from '../models/Fighter';
import { storeToRefs } from 'pinia';
import { useStore } from '../store';
import { computed } from "vue";

const props = defineProps<{ tile: Tile }>()

const store = useStore()

const { fightersOnTiles } = storeToRefs(store)

const fighterOnThisTile = computed(() => {
  return fightersOnTiles.value[props.tile.id] as Fighter
})
</script>