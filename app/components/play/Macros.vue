<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";
import { AMOUNT_SLOTS_MACROS } from "@/utils/constants";

const { modalMacro } = defineProps<{
  modalMacro: HTMLDivElement;
}>();
defineEmits<{}>();

const uiStore = useUIStore();
const macros = ref<HTMLDivElement[]>([]);
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
  modalMacro.style.left = `${refMacro.offsetLeft - 57}px`;
  modalMacro.style.top = `${refMacro.offsetTop - 210}px`;

  uiStore.ui.keyMacro.indexMacro = key;
  uiStore.ui.keyMacro.idPosItem = -1;
  uiStore.ui.keyMacro.idPosSpell = -1;
  uiStore.ui.keyMacro.idSpell = -1;
  uiStore.ui.keyMacro.key = -1;
  uiStore.ui.keyMacro.keyChar = "";

  // ui.current.setProperties({
  //   keyMacro: uiStore.ui.keyMacro,
  // });
  uiStore.ui.showMacroConfig = true;
};
</script>

<template>
  <div className="{style.macros}">
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
</template>

<style scoped>
.macros {
  width: 580px;
  height: 91px;
  .macro {
    width: 64px;
    height: 64px;
    margin-top: 13px;
    margin-left: 22.2px;
    display: inline-block;
    vertical-align: top;
    position: relative;
    cursor: pointer;
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
