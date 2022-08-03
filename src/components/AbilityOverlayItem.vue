<template>
  <div class="rounded-full border border-gray-200 h-full w-full bg-gray-700 p-1 hover:opacity-80 cursor-pointer">
    <div class="bg-gray-900 h-full w-full rounded-full flex">
      <img v-if="iconPath" class="m-auto h-3/5 w-3/5" :src="iconPath" style="filter: brightness(0) invert(1)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

// TODO: opacity when unavailable

const props = defineProps<{
  ability: {
    id: string
    icon: string
  }
}>()

const iconPath = ref('')

onMounted(async () => {
  iconPath.value = (await import(`../assets/icons/${props.ability.icon}.svg`))?.default
})

</script>