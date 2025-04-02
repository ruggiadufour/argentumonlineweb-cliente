<script setup lang="ts">
import _ from "lodash";
import { useUIStore } from "@/store/ui.store";
import type { Config, UI } from "@/engine";

const { config } = defineProps<{
  config: Config;
}>();

const emits = defineEmits<{}>();
const modalMacro = ref<HTMLDivElement>();
const uiStore = useUIStore();

const handleKeyMacro = (e: KeyboardEvent) => {
  const keyCode = e.keyCode;

  if (
    Object.values(uiStore.ui.keyCodeDefault).indexOf(keyCode) > -1 ||
    !isNaN(Number(uiStore.ui.keyCodeMacros[keyCode]))
  ) {
    uiStore.ui.keyMacro.key = -1;
    uiStore.ui.keyMacro.keyChar = "";
    alert("La tecla ya está asignada");
  } else {
    let fromChar = String.fromCharCode(keyCode);

    if (config.keyCodeMap[keyCode]) {
      fromChar = config.keyCodeMap[keyCode];
    }

    uiStore.ui.keyMacro.key = keyCode;
    uiStore.ui.keyMacro.keyChar = fromChar;
  }
};

const saveMacro = () => {
  uiStore.ui.valueKeyMacro[uiStore.ui.keyMacro.indexMacro] = {
    idPosItem: uiStore.ui.keyMacro.idPosItem,
    idSpell: uiStore.ui.keyMacro.idSpell,
    idPosSpell: uiStore.ui.keyMacro.idPosSpell,
    img: uiStore.ui.keyMacro.img,
    key: uiStore.ui.keyMacro.key,
    keyChar: uiStore.ui.keyMacro.keyChar,
    indexMacro: uiStore.ui.keyMacro.indexMacro,
  };

  uiStore.ui.keyCodeMacros[uiStore.ui.keyMacro.key] = uiStore.ui.keyMacro.indexMacro;
  uiStore.ui.showMacroConfig = false;

  window.localStorage.setItem("macros", JSON.stringify(uiStore.ui.valueKeyMacro));
};

const handleCloseModalMacro = () => {
  uiStore.ui.showMacroConfig = false;
};

defineExpose({
  modalMacro,
});
</script>

<template>
  <div class="modalMacro" v-show="uiStore.ui.showMacroConfig" ref="modalMacro">
    <div class="titleMacro">
      ACCIÓN RÁPIDA
      <button class="closeMacro" @click="handleCloseModalMacro()">x</button>
    </div>

    <input
      type="text"
      @keyup="handleKeyMacro"
      class="keyMacro"
      :value="uiStore.ui.keyMacro.keyChar"
      placeholder="Ingresa una tecla"
    />
    <div class="descriptionMacro">
      Haz click en el item/hechizo que quieres asignar a la tecla
    </div>
    <div class="img">
      <div
        v-if="uiStore.ui.keyMacro.idPosItem && uiStore.ui.keyMacro.img"
        class="item"
        :style="{
          backgroundImage: `url('${uiStore.ui.keyMacro.img}')`,
        }"
      />
    </div>
    <button class="guardarMacro" @click="saveMacro">Guardar</button>
  </div>
</template>

<style scoped>
.modalMacro {
  width: 178px;
  height: 195px;
  background-color: var(--background-color-1);
  color: var(--text-color-1);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-direction: column;
  z-index: 100;
  font-size: 12px;
  padding: 10px;
  border-radius: 8px;
  z-index: 110;

  input {
    background-color: var(--background-color-inverted-1) !important;
    border: none;
    color: var(--text-color-inverted-1) !important;
    text-align: center;
  }

  .descriptionMacro {
    color: var(--text-color-1);
    text-align: center;
  }

  .closeMacro {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: transparent;
    border: none;
    color: var(--text-color-1);
    &:hover {
      cursor: pointer;
    }
  }
  .keyMacro {
    text-align: center;
    background: transparent;
    border: none;
    padding: 8px;
    color: #fff;
    width: 128px;
  }
  .img {
    /* width: 64px;
    height: 64px; */
    .spell {
      width: 60px;
      height: 60px;
      position: relative;
      top: 4px;
      background-size: 100%;
    }
    .item {
      width: 32px;
      height: 32px;
      background-size: 100%;
    }
  }

  .guardarMacro {
    background-color: var(--background-color-inverted-1);
    color: var(--text-color-inverted-1);
    border: none;
    padding: 4px;
    border-radius: 4px;
  }
}
</style>
