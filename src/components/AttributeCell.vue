<template>
  <span class="attribute label">{{ label }}:</span>
  <span class="attribute number" :class="[totalBonus > 0 && 'buffed', totalBonus < 0 && 'debuffed']">
    <span :style="{ color: valueIsModified ? highlightColor : undefined }">{{ computedValue }}</span>
    <span v-if="total && computedValue !== total"> / {{ total }}</span>
  </span>
  <span class="attribute number">
    <span v-if="nonZeroBonusValues?.length" class="attribute number text-clamp-xs">
      ({{ value }}
      <span v-for="bonusValue in nonZeroBonusValues" :class="bonusValue > 0 ? 'buffed' : 'debuffed'"
        :style="{ color: highlightColor }">
        {{ bonusValue > 0 ? ' +' : ' -' }} {{ bonusValue }}
      </span>
      )
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
  label: string,
  value: number,
  bonusValues?: number[]
  total?: number
  highlightColor?: string
}>()

const totalBonus = computed(() => props.bonusValues?.reduce((a, b) => a + b, 0) ?? 0)
const computedValue = computed(() => (props.value ?? 0) + totalBonus.value)
const nonZeroBonusValues = computed(() => props.bonusValues?.filter(v => v !== 0))

const valueIsModified = computed(() => {
  if (nonZeroBonusValues.value?.length) return true
  if (props.total && computedValue.value !== props.total) return true
  return false
})
</script>

<style>
.attribute {
  @apply leading-tight;
}

.attribute.label {
  @apply whitespace-nowrap;
}

.attribute.number {
  padding: 0 3px;
  @apply font-medium text-right;
}
</style>