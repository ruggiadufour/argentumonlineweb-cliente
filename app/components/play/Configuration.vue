<script setup lang="ts">
import _ from "lodash";
import { useUIStore } from "@/store/ui.store";
import type { Config, UI } from "@/engine";
import { generateKeyMacro } from "@/utils/genereators";
import { TNameKeyCode } from "@/types/TNameKeyCode";

const { config } = defineProps<{
  config: Config;
}>();

const emits = defineEmits<{
  (e: "onCharKeyCodeDefault"): void;
}>();
const uiStore = useUIStore();

const handleHideModalControlPanel = () => {
  uiStore.ui.showModalControlPanel = false;
};

const handleKeyDefault = (e: KeyboardEvent, keyType: number) => {
  const keyCode = e.keyCode;

  if (
    Object.values(uiStore.ui.tmpKeyCodeDefault).indexOf(keyCode) > -1 ||
    !isNaN(Number(uiStore.ui.keyCodeMacros[keyCode]))
  ) {
    alert("La tecla ya está asignada");
  } else {
    let fromChar = String.fromCharCode(keyCode);

    if (config.keyCodeMap[keyCode]) {
      fromChar = config.keyCodeMap[keyCode];
    }

    uiStore.ui.tmpKeyCodeDefault[keyType] = keyCode;
    uiStore.ui.charKeyCodeDefault[keyType] = Number(fromChar);
  }

  uiStore.ui.charKeyCodeDefault = uiStore.ui.charKeyCodeDefault;
  uiStore.ui.tmpKeyCodeDefault = uiStore.ui.tmpKeyCodeDefault;
};

const restoreDefaultKeys = async () => {
  const keyCodeDefaultReset = uiStore.ui.keyCodeDefaultReset;

  window.localStorage.setItem("defaultKeys", JSON.stringify(keyCodeDefaultReset));

  uiStore.ui.keyCodeDefault = _.cloneDeep(keyCodeDefaultReset);
  uiStore.ui.tmpKeyCodeDefault = _.cloneDeep(keyCodeDefaultReset);

  emits("onCharKeyCodeDefault");
};

const saveChangesKeys = () => {
  const tmpKeyCodeDefault = uiStore.ui.tmpKeyCodeDefault;

  window.localStorage.setItem("defaultKeys", JSON.stringify(tmpKeyCodeDefault));

  uiStore.ui.keyCodeDefault = _.cloneDeep(tmpKeyCodeDefault);

  alert("Teclas guardadas.");
};

const restoreMacros = () => {
  window.localStorage.setItem("macros", "");

  uiStore.ui.keyCodeMacros = {};
  uiStore.ui.valueKeyMacro = [
    generateKeyMacro(),
    generateKeyMacro(),
    generateKeyMacro(),
    generateKeyMacro(),
    generateKeyMacro(),
    generateKeyMacro(),
  ];

  alert("Macros reseteados.");
};
</script>

<template>
  <div
    class="modalControlPanel"
    :style="{
      display: uiStore.ui.showModalControlPanel ? 'block' : 'none',
    }"
  >
    <div class="closeControlPanel" @click="handleHideModalControlPanel" />
    <div class="sound" />
    <div class="teclas">
      <input
        type="text"
        class="tecla margin_left_tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.flechaArriba]"
        @keyup="handleKeyDefault($event, TNameKeyCode.flechaArriba)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.flechaAbajo]"
        @keyup="handleKeyDefault($event, TNameKeyCode.flechaAbajo)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.flechaIzquierda]"
        @keyup="handleKeyDefault($event, TNameKeyCode.flechaIzquierda)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.flechaDerecha]"
        @keyup="handleKeyDefault($event, TNameKeyCode.flechaDerecha)"
      />

      <input
        type="text"
        class="tecla margin_left_tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.usar]"
        @keyup="handleKeyDefault($event, TNameKeyCode.usar)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.atacar]"
        @keyup="handleKeyDefault($event, TNameKeyCode.atacar)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.agarrar]"
        @keyup="handleKeyDefault($event, TNameKeyCode.agarrar)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.tirar]"
        @keyup="handleKeyDefault($event, TNameKeyCode.tirar)"
      />

      <input
        type="text"
        class="tecla margin_left_tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.equipar]"
        @keyup="handleKeyDefault($event, TNameKeyCode.equipar)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.domar]"
        @keyup="handleKeyDefault($event, TNameKeyCode.domar)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.robar]"
        @keyup="handleKeyDefault($event, TNameKeyCode.robar)"
      />
      <input
        type="text"
        class="tecla"
        :value="uiStore.ui.charKeyCodeDefault[TNameKeyCode.seguro]"
        @keyup="handleKeyDefault($event, TNameKeyCode.seguro)"
      />

      <div class="default_teclas" @click="restoreDefaultKeys" />
      <div class="save_cambios" @click="saveChangesKeys" />
      <div class="reset_macros" @click="restoreMacros" />
    </div>
  </div>
</template>

<style scoped>
.modalControlPanel {
  width: 583px;
  height: 509px;
  background-image: url("/static/imgs/configuracion.png");
  background-repeat: no-repeat;
  z-index: 100;
  position: absolute;
  display: none;
  font-family: "Doppio One", sans-serif;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .sound {
    width: 583px;
    height: 110px;
    .soundButton {
      width: 40px;
      height: 40px;
      background-image: url("/static/imgs/soundButton.png");
      background-repeat: no-repeat;
      position: relative;
      bottom: 11px;
      left: 152px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .teclas {
    width: 583px;
    height: 276px;
    margin-top: 52px;
    font-size: 0;
    .tecla {
      border: 0;
      background-color: #0f0c08;
      color: #fff;
      height: 17px;
      width: 105px;
      text-align: center;
      margin-left: 12px;
      margin-top: 33px;
      display: inline-block;
    }
    .margin_left_tecla {
      margin-left: 58px;
    }
    .default_teclas {
      width: 65px;
      height: 30px;
      margin-bottom: 15px;
      margin-left: 75px;
      cursor: pointer;
      display: inline-block;
    }
    .save_cambios {
      width: 70px;
      height: 35px;
      margin-top: 80px;
      margin-left: 115px;
      cursor: pointer;
      display: inline-block;
    }
    .reset_macros {
      width: 65px;
      height: 30px;
      margin-bottom: 15px;
      margin-left: 110px;
      cursor: pointer;
      display: inline-block;
    }
  }
  .closeControlPanel {
    margin-left: 543px;
    width: 40px;
    height: 40px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
