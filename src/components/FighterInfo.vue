<template>
  <div class="bg-gray-200 flex items-center justify-center xl:justify-start xl:pl-6 text-xs xl:text-base">
    <div>

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
  </div>
</template>

<script setup lang="ts">
import constants from "../constants";
import { FighterData } from '../models/types';

const props = defineProps<{ fighter: FighterData }>()

</script>