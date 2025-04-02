<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";
import { AMOUNT_SLOTS_MACROS } from "@/utils/constants";
import ConfigurationMacro from "@/components/play/ConfigurationMacro.vue";
import type { Config } from "@/engine";

const { config, heightPx } = defineProps<{
  config: Config;
  heightPx: string;
}>();
defineEmits<{}>();

const uiStore = useUIStore();
const macros = ref<HTMLDivElement[]>([]);
const configurationMacro = ref<InstanceType<typeof ConfigurationMacro>>();
const boxMacros = computed(() => {
  const boxes = [];
  for (let i = 0; i < AMOUNT_SLOTS_MACROS; i++) {
    const macro = uiStore.ui.valueKeyMacro[i];
    boxes.push(macro);
  }
  return boxes;
});

const handleShowMacroConfig = (e: MouseEvent, key: number) => {
  e.preventDefault();

  const refMacro = macros.value[key];
  if (!refMacro) return;
  const modalMacro = configurationMacro.value?.modalMacro;

  if (modalMacro) {
    modalMacro.style.left = `${refMacro.offsetLeft - 57}px`;
    modalMacro.style.top = `${refMacro.offsetTop - 210}px`;
  }

  if (boxMacros.value[key]) {
    uiStore.ui.keyMacro = { ...boxMacros.value[key] };
  } else {
    uiStore.ui.keyMacro.indexMacro = key;
    uiStore.ui.keyMacro.idPosItem = -1;
    uiStore.ui.keyMacro.idPosSpell = -1;
    uiStore.ui.keyMacro.idSpell = -1;
    uiStore.ui.keyMacro.key = -1;
    uiStore.ui.keyMacro.keyChar = "";
    uiStore.ui.keyMacro.img = "";
  }

  uiStore.ui.showMacroConfig = true;
};
</script>

<template>
  <div class="macros">
    <ConfigurationMacro ref="configurationMacro" :config="config" />

    <div class="macros_container">
      <div
        v-for="(macro, i) of boxMacros"
        :key="i"
        class="macro"
        @contextmenu="handleShowMacroConfig($event, i)"
        ref="macros"
      >
        <div
          v-if="macro && macro.idPosItem >= 0 && macro.img"
          class="item"
          :style="{
            backgroundImage: `url('${macro.img}')`,
          }"
        />

        <div
          v-if="macro && macro.idSpell >= 0 && macro.img"
          class="spell"
          :style="{
            backgroundImage: `url('${macro.img}')`,
          }"
        />

        <div v-if="macro && macro.keyChar !== ''" class="key">
          {{ macro.keyChar }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.macros {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  height: v-bind(heightPx);

  .macros_container {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 8px;
    }

  .macro {
    width: 64px;
    height: 64px;

    position: relative;
    cursor: pointer;
    background-color: var(--background-color-1);
    border: solid 1px var(--border-color-inverted-1);

    .spell {
      width: 60px;
      height: 60px;
      margin-top: 3px;
      margin-left: 3px;
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .item {
      width: 32px;
      height: 32px;
      margin-top: 17px;
      margin-left: 17px;
      background-repeat: no-repeat;
      background-size: 100%;
      position: absolute;
      top: 0;
    }
    .key {
      color: #aa967f;
      font-family: "Doppio One", sans-serif;
      font-size: 16px;
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
