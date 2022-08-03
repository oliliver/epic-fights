<template>
  <div class="group relative flex-none" :style="tile.styles"
    :class="boardStore.selectedPawn?.tile.id == tile.id && 'bg-opacity-90'" :key="tile.id">
  </div>
</template>

<script setup lang="ts">
import { TTile } from '../models/types';
import { useBoardStore } from '../store';

const props = defineProps<{ tile: TTile }>()

const boardStore = useBoardStore()
</script>