<template>
  <div class="bg-gray-200 p-8">
    <p>
      {{ fighter.tier }}.
    </p>

    <div class="pl-6">
      <p class="flex justify-between">
        <span>HP:</span> <span>{{ constants.DEFAULT_HP }}</span>
      </p>
      <p class="flex justify-between">
        <span>Movement:</span> <span>{{ fighter.movementPoints }}</span>
      </p>
      <p class="flex justify-between">
        <span>Attack:</span> <span>{{ fighter.attackPoints }}</span>
      </p>
      <p class="flex justify-between">
        <span>Defense:</span> <span>{{ fighter.defensePoints }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import constants from "../constants";
import { FighterData } from '../models/types';

const props = defineProps<{ fighter: FighterData }>()

</script>