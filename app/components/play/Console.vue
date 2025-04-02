<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";

defineProps<{}>();
defineEmits<{}>();

const uiStore = useUIStore();
const messages = computed(()=> [...uiStore.ui.messagesConsole].reverse())

const openConsole = () => {
  uiStore.ui.showConsole = !uiStore.ui.showConsole;
};
</script>

<template>
  <div
    id="console"
    class="console"
    :style="{
      display: uiStore.ui.showConsole ? 'block' : 'none',
    }"
  >
    <span
      v-for="message in messages"
      :style="message.style"
      :key="message.id"
      v-html="message.message"
    />
  </div>
  <button class="openConsole" title="Abrir o cerrar consola" @click="openConsole">
    📨
  </button>
</template>

<style scoped>
.console {
  width: 100%;
  height: 100px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  text-align: left;
  padding: 5px 0px 0px 5px;
  overflow-y: hidden;
  font-size: 14px;
  word-wrap: break-word;
  position: absolute;
  bottom: -1px;
  z-index: 6;
  display: none;
  font-family: "Doppio One", sans-serif;
  overflow: auto;
  z-index: 40;
  user-select: text;
  box-sizing: border-box;

  span {
    display: block;
  }
}
.openConsole {
  z-index: 50;
  position: absolute;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  bottom: 8px;
  right: 8px;
  font-size: 24px;
  cursor: pointer;
  background-color: var(--background-color-1);
  border: solid 1px var(--border-color-inverted-1);
  svg {
    padding: 10px;
    font-size: 16px !important;
  }
}
</style>
