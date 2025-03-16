<script setup lang="ts">
import _ from "lodash";
import {
  UI,
  Config,
  Inits,
  Engine,
  General,
  Messages,
  Connection,
  Game,
  User,
  Package,
} from "@/engine";
import {
  LoadingInfo,
  Configuration,
  ConfigurationMacro,
  ModalTrade,
  Macros,
  Console,
  PlayerPannel,
  GameView,
} from "@/components";
import { useUIStore } from "@/store/ui.store";
import type { TUI } from "@/types";

const uiStore = useUIStore();
const modalMacro = ref<HTMLDivElement>();
const gameView = ref<InstanceType<typeof GameView>>();
const canvas: Record<string, HTMLCanvasElement | null> = {
  background: null,
  techos: null,
  foreground: null,
  items: null,
  textos: null,
};
const ui = new UI(uiStore as any);
let pkg: Package = {};
let inits: Inits = {};
let user: User = {};
let general: General = {};
let game: Game = {};
let engine: Engine = {};
let messages: Messages = {};
let connection: Connection = {};
let config: Config = {};

onMounted(() => {
  setCanvas();
 
  const asyncInit = async () => {
    const macros = window.localStorage.getItem("macros");
    if (macros) {
      let tmpKeyCodeMacros: TUI["keyCodeMacros"] = {};
      const jsonMacros = JSON.parse(macros) as TUI["valueKeyMacro"];

      jsonMacros.map((macro, index: number) => {
        if (macro.key) {
          tmpKeyCodeMacros[macro.key] = index;
        }
      });

      uiStore.ui.valueKeyMacro = jsonMacros;
      uiStore.ui.keyCodeMacros = tmpKeyCodeMacros;
    }

    const defaultKeys = window.localStorage.getItem("defaultKeys");

    if (defaultKeys) {
      const jsonDefaultKeys = JSON.parse(defaultKeys);

      // TODO: ver si este await tiene algun efecto con el cambio
      //   await ui.setProperties({
      //     keyCodeDefault: _.cloneDeep(jsonDefaultKeys),
      //     tmpKeyCodeDefault: _.cloneDeep(jsonDefaultKeys),
      //   });
      uiStore.ui.keyCodeDefault = _.cloneDeep(jsonDefaultKeys);
      uiStore.ui.tmpKeyCodeDefault = _.cloneDeep(jsonDefaultKeys);
    }

    config = new Config();
    pkg = new Package();
    user = new User();

    inits = new Inits(ui);
    // inits.setUI(props);

    general = new General(pkg, config);
    game = new Game(inits, ui, user, pkg, config);
    engine = new Engine(inits, ui, user, pkg, config, game, canvas);
    messages = new Messages(ui, user, engine, inits, pkg, config, game);
    connection = new Connection(ui, messages, pkg, game, engine, user, config);

    handleCharKeyCodeDefault();

    await engine.initCanvas();

    connection.startWebSocket();

    uiStore.ui.loading = false;

    document.oncontextmenu = (e) => {
      e.stopPropagation();
      return false;
    };

    document.onkeyup = (e) => {
      const keyCode = e.keyCode;

      if (uiStore.ui.showMacroConfig) return;

      if (
        !uiStore.ui.showInputText &&
        !isNaN(Number(uiStore.ui.keyCodeMacros[keyCode]))
      ) {
        const code = uiStore.ui.keyCodeMacros[keyCode];
        const macro = uiStore.ui.valueKeyMacro[code!];
        if (!macro) return;

        if (macro.idPosItem !== -1) {
          game.useItem(macro.idPosItem);
        } else if (macro.idSpell !== -1) {
          handleSelectSpell(macro.idPosSpell);
        }
        return;
      }

      //Usar
      if (
        keyCode == uiStore.ui.keyCodeDefault[config.nameKeyCode.usar || -1] &&
        !uiStore.ui.showInputText
      ) {
        if (uiStore.ui.selectItem) game.useItem(uiStore.ui.selectItem);
      }

      //Equipar
      if (
        keyCode == uiStore.ui.keyCodeDefault[config.nameKeyCode.equipar || -1] &&
        !uiStore.ui.showInputText
      ) {
        const item = user.items[uiStore.ui.selectItem];

        if (uiStore.ui.selectItem && item)
          game.equiparItem(uiStore.ui.selectItem, item.idItem);
      }

      //Agarrar
      if (
        keyCode == uiStore.ui.keyCodeDefault[config.nameKeyCode.agarrar || -1] &&
        !uiStore.ui.showInputText
      ) {
        pkg.setPackageID(pkg.serverPacketID.agarrarItem);
        config.ws.send(pkg.dataSend());
      }

      //Tirar
      if (
        keyCode == uiStore.ui.keyCodeDefault[config.nameKeyCode.tirar || -1] &&
        !uiStore.ui.showInputText
      ) {
        let cantItem = 1;

        if (uiStore.ui.selectItem) {
          const promptResult = prompt("¿Cuántos quieres tirar?", "1");
          cantItem = parseInt(promptResult || "1");
        }

        if (cantItem > 0) {
          pkg.setPackageID(pkg.serverPacketID.tirarItem);
          pkg.writeInt(uiStore.ui.selectItem);
          pkg.writeShort(Math.trunc(cantItem));
          config.ws.send(pkg.dataSend());
        }
      }

      //Enter
      if (keyCode == 13) {
        if (uiStore.ui.showInputText) {
          general.sendDialog(uiStore.ui.textDialog);

          uiStore.ui.textDialog = "";
        }

        uiStore.ui.showInputText = !uiStore.ui.showInputText;
      }

      if (keyCode == 77 && !uiStore.ui.showInputText) {
        general.sendDialog("/meditar");
      }

      if (
        keyCode == uiStore.ui.keyCodeDefault[config.nameKeyCode.seguro || -1] &&
        !uiStore.ui.showInputText
      ) {
        if (config.seguroActivado) {
          config.seguroActivado = false;
        } else {
          config.seguroActivado = true;
        }

        pkg.setPackageID(pkg.serverPacketID.changeSeguro);
        config.ws.send(pkg.dataSend());
      }
      if (keyCode == uiStore.ui.keyCodeDefault[config.nameKeyCode.atacar || -1]) {
        if (+Date.now() - config.timeHitStart > config.intervalHit) {
          engine.hit();
        }
      }

      const event_ = (event || window.event) as any;
      if (event_.ctrlKey) {
        const c = event_.which || keyCode;
        switch (c) {
          case 83:
          case 87:
          case 68:
            event_.preventDefault();
            event_.stopPropagation();
            break;
        }
      }
    };
  };

  asyncInit();
});

onBeforeUnmount(() => {
  document.oncontextmenu = null;
  document.onkeyup = null;
});

const setCanvas = () => {
  if (!gameView.value) return;

  canvas.background = gameView.value?.canvasBackground || null;
  canvas.techos = gameView.value?.canvasTechos || null;
  canvas.foreground = gameView.value?.canvasForeground || null;
  canvas.items = gameView.value?.canvasItems || null;
  canvas.textos = gameView.value?.canvasTextos || null;
};

const handleCharKeyCodeDefault = () => {
  const keyCodeDefault = uiStore.ui.keyCodeDefault;
  const charKeyCodeDefault = uiStore.ui.charKeyCodeDefault;

  Object.keys(keyCodeDefault).map((key) => {
    const keyCode = keyCodeDefault[key];

    let fromChar = String.fromCharCode(keyCode || 0);

    if (keyCode && config.keyCodeMap[keyCode]) {
      fromChar = config.keyCodeMap[keyCode];
    }

    charKeyCodeDefault[Number(key)] = Number(fromChar);
  });

  uiStore.ui.charKeyCodeDefault = charKeyCodeDefault;
};

const handleSelectSpell = (i: number) => {
  const spell = user.spells[i];

  if (uiStore.ui.showMacroConfig && spell) {
    uiStore.ui.keyMacro.idSpell = spell.idSpell;
    uiStore.ui.keyMacro.idPosSpell = i;
    uiStore.ui.keyMacro.idPosItem = -1;
    uiStore.ui.keyMacro.img = `/static/spells/${spell.idSpell}.png`;
    return;
  }

  if (user.maxMana > 0) {
    config.hechizoSelected = i;
    uiStore.ui.crosshair = true;
    game.writeConsole("Haz click sobre el objetivo...", "gray");
  }
};
</script>

<template>
  <LoadingInfo v-if="uiStore.ui.loading" />

  <ul class="modalInfo" />

  <Configuration
    v-if="!uiStore.ui.loading"
    :config="config"
    @on-char-key-code-default="handleCharKeyCodeDefault"
  />

  <div class="modalReconnect" style="top: 285px; left: 638.5px" />

  <ConfigurationMacro v-if="modalMacro" :modal-macro="modalMacro" :config="config" />

  <ModalTrade 
    v-if="!uiStore.ui.loading"
    @on-buy-trade="game.buyTrade"
    @on-sell-trade="game.sellTrade"
  />

  <div class="outer" :style="{ display: uiStore.ui.loading ? 'none' : 'table' }">
    <div class="middle">
      <div class="content">
        <div class="content_left">
          <div class="render">
            <input
              v-show="uiStore.ui.showInputText"
              type="text"
              name="text"
              autoFocus
              class="text"
              ref="input"
              v-model="uiStore.ui.textDialog"
            />
            <GameView 
              ref="gameView"
              :engine="engine" 
              :canvas="canvas" 
            />
            <Console v-if="!uiStore.ui.loading" />
          </div>

          <Macros v-if="modalMacro" :modal-macro="modalMacro" />
        </div>
        <PlayerPannel
          v-if="!uiStore.ui.loading"
          @on-char-key-code-default="handleCharKeyCodeDefault"
          @on-select-spell="handleSelectSpell"
          @on-use-item="game.useItem"
          :config="config"
          :graphics="inits.graphics"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer {
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;
  user-select: none;
  .middle {
    display: table-cell;
    vertical-align: middle;
    .content {
      width: 963px;
      height: 659px;
      background-image: url("/static/imgs/main.png");
      background-repeat: no-repeat;
      margin: 0 auto;
      font-size: 0;
      .content_left {
        width: 580px;
        height: 659px;
        display: inline-block;
        vertical-align: top;
        .render {
          width: 544px;
          height: 544px;
          margin-top: 24px;
          margin-left: 16px;
          background-color: #000;
          position: relative;
        }
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
        .text {
          outline-width: 0;
          position: absolute;
          margin: 0px;
          width: 538px;
          display: none;
          z-index: 10;
        }
      }
    }
  }
}
.modalInfo {
  position: absolute;
  background-color: #f00;
  list-style: none;
  padding: 0;
  margin: 0;
  background: #11171d;
  border: 1px solid #18222c;
  margin-top: 10px;
  width: 150px;
  padding: 0 10px;
  overflow-y: auto;
  font-family: "Doppio One", sans-serif;
  z-index: 100;
  display: none;
  li {
    font-size: 11px;
    padding: 5px 0;
    float: left;
    width: 100%;
    border-bottom: 1px solid #18222c;
    &:last-child {
      border-bottom: 0;
    }
    .detalle {
      text-align: right;
      width: 100px;
      color: #830e0e;
    }
    span {
      color: #496076;
    }
  }
}
</style>
