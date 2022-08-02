<template>
  <span class="attribute string">{{ label }}:</span>
  <span class="attribute number"
    :class="[bonusValue && bonusValue > 0 && 'buffed', bonusValue && bonusValue < 0 && 'debuffed']">
    <span :style="{ color: valueIsModified ? highlightColor : undefined }">{{ computedValue }}</span>
    <span v-if="total && computedValue !== total"> / {{ total }}</span>
  </span>
  <span class="attribute number">
    <span v-if="bonusValue" class="attribute number text-clamp-xs">
      ({{ value }} <span :class="bonusValue > 0 ? 'buffed' : 'debuffed'">
        <span :style="{ color: highlightColor }">{{ bonusValue > 0 ? ' +' : ' -' }} {{ bonusValue }}</span></span>)
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
  label: string,
  value: number,
  bonusValue?: number
  total?: number
  highlightColor?: string
}>()

const computedValue = computed(() => (props.value ?? 0) + (props.bonusValue ?? 0))

const valueIsModified = computed(() => {
  if (props.value !== computedValue.value) return true
  if (props.total && computedValue.value !== props.total) return true
  return false
})
</script>

<style>
.attribute.string {
  @apply leading-tight;
}

.attribute.number {
  padding: 0 3px;
  @apply leading-tight font-medium text-right;
}
</style>