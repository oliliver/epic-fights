<template>
  <button class="btn py-1" :style="{ color }">
    <div class="btn-content">
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: '#777'
  }
})
</script>