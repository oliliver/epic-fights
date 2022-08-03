<template>
  <div class="flex gap-2 p-2 rounded" :style="{ backgroundColor: player.colorValue(200) }">
    <p class="h-full text-clamp-md">
      {{ fighter.tier }}.
    </p>
    <div class="flex flex-col gap-4 xl:gap-6 xl:pl-6 text-clamp-sm">
      <AttributeGrid>
        <AttributeCell label="Health" :value="fighter.healthPoints ?? constants.DEFAULT_HP"
          :total="fighter.healthPointsMax" :highlight-color="player.colorValue(600)" />
        <AttributeCell label="Movement" :value="fighter.movementPoints" :highlight-color="player.colorValue(600)" />
        <AttributeCell label="Attack" :value="fighter.attackPoints" :bonus-values="[abilityDamage, passiveBonusDamage]"
          :highlight-color="player.colorValue(600)" />
        <AttributeCell label="Defense" :value="fighter.defensePoints" :highlight-color="player.colorValue(600)" />
      </AttributeGrid>
      <div v-if="abilities.length" class="flex flex-col items-start">
        <p>Abilities:</p>
        <div class="flex flex-col gap-6">
          <div v-for="ability in abilities" :key="ability.name" class="pl-2 xl:pl-6 flex flex-col items-start">
            <div class="flex gap-[2px] flex-wrap w-full">
              <span class="font-bold">{{ ability.name }}</span>
              <span v-if="ability.passivity == Passivity.PASSIVE">(passive)</span>
              <span v-if="selectedFighterIsOfThisType && ability.passivity == Passivity.PASSIVE"
                class="italic rounded bg-white px-1 bg-opacity-90 ml-auto">
                <span v-if="ability.isAvailable()" class="text-green-600">active</span>
                <span v-else class="text-pink-600">inactive</span>
              </span>
            </div>

            <AttributeGrid>
              <AttributeCell v-if="ability.usesTotal !== Infinity" label="Uses"
                :value="selectedFighterIsOfThisType ? ability?.usesLeftTotal : ability.usesTotal"
                :total="ability.usesTotal" :highlight-color="player.colorValue(600)" />
              <AttributeCell v-if="ability.restoration" label="Restoration" :value="ability.restoration"
                :highlight-color="player.colorValue(600)" />
              <AttributeCell v-if="ability.damage" label="Damage" :value="ability.damage"
                :highlight-color="player.colorValue(600)" />
              <AttributeCell v-if="ability.damageBuff" label="Damage buff" :value="ability.damageBuff"
                :highlight-color="player.colorValue(600)" />
            </AttributeGrid>
            <p class="italic font-thin text-gray-700"> {{ ability.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import constants from "../constants";
import { useBoardStore } from "../store";
import { computed } from "@vue/reactivity";
import { TAbility, Passivity } from '../models/types';
import { neutralPlayer, TPlayer } from "../models/Player";
import AttributeCell from "./AttributeCell.vue";
import AttributeGrid from "./AttributeGrid.vue";
import Fighter from "../models/Fighter";

const props = defineProps<{ fighter: Fighter }>()

const selectedPawnFighter = computed(() => useBoardStore().selectedPawn?.fighter)

const selectedFighterIsOfThisType = computed(() => selectedPawnFighter.value?.fighterId == props.fighter.fighterId)

const player = computed(() => selectedFighterIsOfThisType.value ? selectedPawnFighter.value?.player as TPlayer : neutralPlayer)

const fighter = computed(() => selectedFighterIsOfThisType.value ? selectedPawnFighter.value : props.fighter)

const abilities = computed(() => (fighter.value?.abilities ?? []) as TAbility[])

const abilityDamage = computed(() => fighter.value?.currentAbility.damageBuff || 0)
const passiveBonusDamage = computed(() => fighter.value?.getPassiveDamageModification() || 0)
</script>