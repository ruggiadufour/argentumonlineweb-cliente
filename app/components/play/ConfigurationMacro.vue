<script setup lang="ts">
import _ from "lodash";
import { useUIStore } from "@/store/ui.store";
import type { Config, UI } from "@/engine";

const { config, modalMacro } = defineProps<{
  modalMacro: HTMLDivElement;
  config: Config;
}>();

const emits = defineEmits<{}>();
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

  // ui.setProperty("keyMacro", uiStore.ui.keyMacro);
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

  // ui.setProperties({
  //     valueKeyMacro: uiStore.ui.valueKeyMacro,
  //     keyCodeMacros: uiStore.ui.keyCodeMacros,
  // });
  uiStore.ui.showMacroConfig = false;

  window.localStorage.setItem("macros", JSON.stringify(uiStore.ui.valueKeyMacro));
};

const handleCloseModalMacro = () => {
  uiStore.ui.showMacroConfig = false;
};
</script>

<template>
  <div
    class="modalMacro"
    :style="{ display: uiStore.ui.showMacroConfig ? 'block' : 'none' }"
    ref="modalMacro"
  >
    <div class="cruz closeMacro" @click="handleCloseModalMacro()" />
    <input
      type="text"
      @keyup="handleKeyMacro"
      class="keyMacro"
      :value="uiStore.ui.keyMacro.keyChar"
    />
    <div class="img">
      <div
        v-if="uiStore.ui.keyMacro.idPosItem && uiStore.ui.keyMacro.img"
        class="item"
        :style="{
          backgroundImage: `url('${uiStore.ui.keyMacro.img}')`,
        }"
      />

      <div
        v-if="uiStore.ui.keyMacro.idSpell && uiStore.ui.keyMacro.img"
        class="spell"
        :style="{
          backgroundImage: `url('${uiStore.ui.keyMacro.img}')`,
        }"
      />
    </div>
    <div class="guardarMacro" @click="saveMacro" />
  </div>
</template>

<style scoped>
.modalMacro {
  width: 178px;
  height: 195px;
  background-image: url("/static/imgs/macros.png");
  background-repeat: no-repeat;
  position: absolute;
  display: none;
  z-index: 100;
  font-family: "Doppio One", sans-serif;
  .closeMacro {
    float: right;
    &:hover {
      cursor: pointer;
    }
  }
  .guardarMacro {
    width: 65px;
    height: 15px;
    margin-top: 2px;
    margin-left: 57px;
    &:hover {
      cursor: pointer;
    }
  }
  .keyMacro {
    text-align: center;
    background: transparent;
    border: none;
    margin-top: 16px;
    margin-left: 17px;
    padding: 8px;
    color: #fff;
    width: 128px;
  }
  .img {
    width: 64px;
    height: 64px;
    margin-top: 34px;
    margin-left: 57px;
    .spell {
      width: 60px;
      height: 60px;
      position: relative;
      top: 4px;
      margin-left: 2px;
      background-size: 100%;
    }
    .item {
      width: 32px;
      height: 32px;
      position: relative;
      top: 16px;
      margin-left: 16px;
      background-size: 100%;
    }
  }
}
</style>
