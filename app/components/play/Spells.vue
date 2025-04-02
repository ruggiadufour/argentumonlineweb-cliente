<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";

defineProps<{}>();
defineEmits<{
  (e: "onSelectSpell", idSpell: number): void;
}>();

const uiStore = useUIStore();

const boxSpells = computed(() => {
  const boxes = [];
  for (let i = 1; i < 29; i++) {
    const spell = uiStore.ui.user.spells?.[i];
    boxes.push(spell);
  }
  return boxes;
});
</script>

<template>
  <div
    v-for="(spell, i) in boxSpells"
    :key="i"
    class="slot_spell"
    @click="$emit('onSelectSpell', i)"
  >
    <div
      class="img_spell"
      :style="{
        backgroundImage: spell ? `url('/static/spells/${spell.idSpell}.png')` : 'none',
      }"
    />
    <div v-if="spell" class="name_spell">
      {{ spell ? spell.name : '' }}
    </div>
  </div>
</template>

<style scoped>
.slot_spell {
  cursor: pointer;
  width: 64px;
  height: 64px;
  border: 1px solid var(--border-color-inverted-1);
  background-repeat: no-repeat;
  display: inline-block;
  position: relative;
  .img_spell {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 2px;
    left: 2px;
    background-size: 100%;
  }

  .name_spell {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: auto;
    display: none;
    background-color: var(--background-color-2);
    color: var(--text-color-1);
    border: 1px solid var(--border-color-inverted-1);
    padding: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 200;
  }

  &:hover {
    .name_spell {
      display: block;
    }
  }
}
</style>
