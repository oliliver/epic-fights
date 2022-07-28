<template>
  <transition name="fade-30" appear>
    <div class="p-2 z-20 bg-gray-200 opacity-30" :key="boardStore.selectedPawnId">
      <div :style="{ backgroundColor: '#777' }" class="rounded-lg h-full w-full" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useBoardStore } from "../store";

const boardStore = useBoardStore()
</script>
