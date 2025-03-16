<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";

defineProps<{}>();
defineEmits<{}>();

const uiStore = useUIStore();

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
      v-for="message in uiStore.ui.messagesConsole"
      :style="message.style"
      :key="message.id"
      v-html="message.message"
    />
  </div>
  <div class="openConsole" title="Abrir o cerrar consola" @click="openConsole">
    <!-- <FontAwesomeIcon icon={faComment as any} /> -->
  </div>
</template>

<style scoped>
.console {
  user-select: none;
  width: 539px;
  height: 100px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  text-align: left;
  padding: 5px 0px 0px 5px;
  overflow-y: hidden;
  font-size: 12px;
  word-wrap: break-word;
  position: absolute;
  top: 439px;
  z-index: 6;
  display: none;
  font-family: "Doppio One", sans-serif;

  span {
    display: block;
  }
}
.openConsole {
  z-index: 7;
  position: absolute;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  top: 508px;
  left: 508px;
  cursor: pointer;
  svg {
    padding: 10px;
    font-size: 16px !important;
  }
}
</style>
