<template>
  <div class="group relative flex-none" :style="tile.styles"
    :class="tile.classes, boardStore.selectedPawn?.tile.id == tile.id && 'bg-opacity-90'" :key="tile.id">
  </div>
</template>

<script setup lang="ts">
import Tile from '../models/Tile';
import { useBoardStore } from '../store';

const props = defineProps<{ tile: Tile }>()

const boardStore = useBoardStore()
</script>