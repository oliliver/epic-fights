<template>
  <div class="flex items-center gap-2 bg-gray-200 p-2">
    <p class="h-full text-clamp-md">
      {{ fighter.tier }}.
    </p>
    <div class="bg-gray-200 flex flex-wrap gap-2 xl:gap-6 justify-center xl:justify-start xl:pl-6 text-clamp-sm">
      <div>
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
      <div v-if="abilities.length" class="flex flex-col items-start">
        <p>
          Abilities:
        </p>
        <div class="flex flex-col gap-6">
          <div v-for="ability in abilities" :key="ability.id" class="pl-6">
            <strong>
              {{ ability.name }}
            </strong>
            <p>
              Uses: {{ ability.uses }}
            </p>
            <p>
              Damage: {{ ability.damage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import constants from "../constants";
import { FighterData } from '../models/types';

const props = defineProps<{ fighter: FighterData }>()

const abilities = Object.values(props.fighter.abilities ?? {})

</script>