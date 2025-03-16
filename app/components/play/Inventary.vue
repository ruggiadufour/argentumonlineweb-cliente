<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";
import type User from "@/engine/user";

const props = defineProps<{
  graphics: any;
}>();

const emits = defineEmits<{
  (e: "onSelectItem", i: number): void;
  (e: "onUseItem", i: number): void;
}>();
const uiStore = useUIStore();
const lastClickIdItem = useState("lastClickIdItem", () => 0);
const clickUse = useState("clickUse", () => 0);

const getSlots = () => {
  const slots_ = [];
  for (let i = 1; i < 22; i++) {
    slots_.push(uiStore.ui.user.items?.[i] || null);
  }
  return slots_ as (User["items"][string] | null)[];
};

const selectItem = (i: number) => {
  emits("onSelectItem", i);

  if (uiStore.ui.showMacroConfig) {
    const items = uiStore.ui.user.items;
    const item = items[i];

    if (item) {
      uiStore.ui.keyMacro.idSpell = -1;
      uiStore.ui.keyMacro.idPosItem = i;
      uiStore.ui.keyMacro.img = `/static/graficos/${
        props.graphics[item.grhIndex].numFile
      }.png`;
    }

    // ui.current.setProperty("keyMacro", currentKeyMacro);

    return;
  }

  if (clickUse.value > 1 && lastClickIdItem.value == i) {
    clickUse.value = 0;
    emits("onUseItem", i);
  }

  clickUse.value++;
  lastClickIdItem.value = i;
};

const getStyle = (item: any) => {
  return {
    backgroundImage: item
      ? `url("/static/graficos/${props.graphics[item.grhIndex].numFile}.png")`
      : "none",
  };
};
</script>

<template>
  <div className="">
    <div
      v-for="(item, i) in getSlots()"
      :class="['slot_inv', uiStore.ui.itemSelected === i ? 'item_selected' : '']"
      :key="i"
      @click="selectItem(i)"
    >
      <div
        :class="['img_item', item && !item.validUser ? 'itemNotValid' : '']"
        :style="getStyle(item)"
      />
      <div class="amount">{{ item ? item.cant : "" }}</div>
      <div v-if="item && item.equipped" class="equipped">E</div>
    </div>
  </div>
</template>

<style scoped>
.slot_inv {
  cursor: pointer;
  width: 38px;
  height: 38px;
  background-image: url("/static/imgs/slotInv.png");
  background-repeat: no-repeat;
  display: inline-block;
  margin-right: 4px;
  margin-bottom: 4px;
  position: relative;
  .img_item {
    width: 32px;
    height: 32px;
    position: absolute;
    top: 3px;
    left: 3px;
    background-size: 100%;
  }
  .amount {
    width: 32px;
    height: 32px;
    position: absolute;
    top: 3px;
    left: 3px;
    color: #fff;
    font-family: "Doppio One", sans-serif;
    font-size: 10px;
  }
  .equipped {
    color: #ff0;
    font-family: "Doppio One", sans-serif;
    font-size: 11px;
    position: absolute;
    bottom: 1px;
    right: 4px;
  }
}
.item_selected {
  background-image: url("/static/imgs/itemSelected.png");
  background-repeat: no-repeat;
}
.last_slot_inv {
  margin-right: 0;
}
.itemNotValid {
  background-color: rgba(255, 0, 0, 0.2);
}
</style>
