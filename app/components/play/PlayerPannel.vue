<script setup lang="ts">
import _ from "lodash";
import { useUIStore } from "@/store/ui.store";
import type { Config } from "@/engine";
import type { TGraphic } from "@/types";
import Inventary from "@/components/play/Inventary.vue";
import Spells from "@/components/play/Spells.vue";

const { config, graphics } = defineProps<{
  config: Config;
  graphics: Record<string, TGraphic>;
}>();
const emit = defineEmits<{
  (e: "onCharKeyCodeDefault"): void;
  (e: "onSelectSpell", idSpell: number): void;
  (e: "onUseItem", i: number): void;
}>();

const uiStore = useUIStore();

const user = computed(() => uiStore.ui.user);

const progressBarPx = computed(() => {
  return `${
    (((uiStore.ui.user.exp * 100) / uiStore.ui.user.expNextLevel) * config.xpLength) / 100
  }px`;
});

const progressBarHpPx = computed(() => {
  return `${(uiStore.ui.user.hp * config.hpLength) / uiStore.ui.user.maxHp}px`;
});

const progressBarManaPx = computed(() => {
  return `${(uiStore.ui.user.mana * config.manaLength) / uiStore.ui.user.maxMana}px`;
});

const percentage = computed(() => {
  return `${((uiStore.ui.user.exp * 100) / uiStore.ui.user.expNextLevel).toFixed(2)}%`;
});

const mapInfo = computed(() => {
  return uiStore.ui.user.pos
    ? `(${config.mapNumber}, ${uiStore.ui.user.pos.x}, ${uiStore.ui.user.pos.y})`
    : "";
});

const handleShowInventary = () => {
  uiStore.ui.showInventary = true;
};

const handleShowSpells = () => {
  uiStore.ui.showInventary = false;
};

const handleSelectItem = (i: number) => {
  uiStore.ui.selectItem = i;
};

const handleShowConfiguration = () => {
  uiStore.ui.showModalControlPanel = true;
  uiStore.ui.tmpKeyCodeDefault = _.cloneDeep(uiStore.ui.keyCodeDefault);
  emit("onCharKeyCodeDefault");
};
</script>

<template>
  <div class="content_right">
    <div class="header">
      <div class="level">{{ uiStore.ui.user.level }}</div>
      <button class="configuration" @click="handleShowConfiguration">💡</button>

      <div class="name">{{ uiStore.ui.user.nameCharacter }}</div>
      <div class="exp">
        <div
          class="progress_bar"
          :style="{
            width: progressBarPx,
          }"
        />
        <div class="porcentaje">
          {{ percentage }}
        </div>
        <div class="num">{{ user.exp }} / {{ user.expNextLevel }}</div>
      </div>
      <div class="buttons">
        <button
          class="button_inventary"
          :class="{ active: uiStore.ui.showInventary }"
          @click="handleShowInventary"
        >
          Inventario
        </button>
        <button
          class="button_inventary"
          :class="{ active: !uiStore.ui.showInventary }"
          @click="handleShowSpells"
        >
          Hechizos
        </button>
      </div>
    </div>
    <div class="body">
      <div v-show="uiStore.ui.showInventary" class="inventary">
        <Inventary
          :graphics="graphics"
          @on-select-item="handleSelectItem"
          @on-use-item="emit('onUseItem', $event)"
        />
      </div>
      <div v-show="!uiStore.ui.showInventary" class="spell">
        <Spells @on-select-spell="emit('onSelectSpell', $event)" />
      </div>
    </div>
    <div class="footer">
      <div class="left_footer">
        <div class="hp">
          <div
            class="progress_bar"
            :style="{
              width: progressBarHpPx,
            }"
          />
          <div class="num">
            {{ `${user.hp} / ${user.maxHp}` }}
          </div>
        </div>
        <div class="mana">
          <div
            class="progress_bar"
            :style="{
              width: progressBarManaPx,
            }"
          />
          <div class="num">
            {{ `${user.mana} / ${user.maxMana}` }}
          </div>
        </div>
        <div class="gold">
          {{ user.gold }}
        </div>
        <div class="attr">
          <div class="agilidad">
            {{ user.attrAgilidad }}
          </div>
          <div class="fuerza">
            {{ user.attrFuerza }}
          </div>
        </div>
      </div>
      <div class="right_footer">
        <div class="info_map">
          <div class="name_map">
            {{ uiStore.ui.nameMap }}
          </div>
          <div class="name_map">
            {{ mapInfo }}
          </div>
        </div>
        <div
          class="minimap"
          :style="{
            backgroundImage: config.mapNumber
              ? `url('/static/imgs_mapas/${config.mapNumber}.png')`
              : 'none',
          }"
        >
          <div
            class="point_minimap"
            :style="{
              top: user.pos ? `${user.pos.y - 1}px` : 0,
              left: user.pos ? `${user.pos.x - 1}px` : 0,
            }"
          />
        </div>

        <div class="buttons_map">
          <div class="open_map" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content_right {
  display: grid;
  grid-template-rows: 1fr minmax(0, 300px) 1fr;
  grid-template-columns: 1fr;
  gap: 8px;
  height: 100vh;
  box-sizing: border-box;
  background-color: var(--background-color-2);
  z-index: 100;
  padding: 8px;

  .header {
    font-size: 0;
    background-color: var(--background-color-1);
    color: var(--text-color-inverted-1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    font-size: 16px;
    position: relative;
    padding: 16px;

    .level {
      text-align: center;
      width: 60px;
      height: 20px;
      color: #aa967f;
      font-family: "Doppio One", sans-serif;
      font-size: 16px;
      display: inline-block;
      vertical-align: top;
      cursor: default;
    }
    .configuration {
      width: 40px;
      height: 40px;
      display: inline-block;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      background-color: transparent;
      border: none;
      font-size: 24px;
    }
    .name {
      height: 30px;
      color: #aa967f;
      font-family: "Doppio One", sans-serif;
      font-size: 24px;
      text-align: center;
      cursor: default;
    }
    .exp {
      width: 203px;
      height: 22px;
      position: relative;

      .progress_bar {
        position: absolute;
        height: 22px;
        background-image: url("/static/imgs/fullXP.png");
        background-repeat: no-repeat;
        background-position: -20px -17px;
        max-width: 203px;
      }

      .porcentaje {
        position: absolute;
        height: 22px;
        color: #aa967f;
        font-family: "Doppio One", sans-serif;
        font-size: 12px;
        text-align: center;
        text-shadow: 1px 1px 1px #000;
        cursor: default;
      }
      .num {
        display: none;
        position: absolute;
        right: 0;
        text-align: right;
        height: 22px;
        color: #aa967f;
        font-family: "Doppio One", sans-serif;
        font-size: 12px;
        text-align: center;
        text-shadow: 1px 1px 1px #000;
        cursor: default;
      }

      &:hover {
        .num {
          display: block;
        }
        .porcentaje {
          display: none;
        }
      }
    }
    .buttons {
      font-size: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100%;

      .button_inventary {
        background-color: var(--background-color-1);
        cursor: pointer;
        font-size: 24px;
        border: solid 1px var(--border-color-inverted-1);
        color: var(--text-color-1);
        width: 100%;
        
        &.active {
          background-color: var(--background-color-inverted-1);
          color: var(--text-color-inverted-1);
          border: solid 1px var(--border-color-1);
        }
      }
    }
  }
  .body {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: var(--background-color-1);
    color: var(--text-color-inverted-1);
    padding: 0px;
    box-sizing: border-box;
    overflow: auto;

    /* .inventary {
      width: 100%;
      font-size: 0;
    } */

    .inventary, .spell {
      overflow-y: auto;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 8px;
    }
  }
  .footer {
    vertical-align: top;
    font-size: 0;
    background-color: var(--background-color-1);
    padding: 16px;
    box-sizing: border-box;
    color: var(--text-color-inverted-1);
    position: relative;
    display: flex;
    gap: 8px;

    .info_map {
      color: var(--text-color-1);
      font-family: "Doppio One", sans-serif;
      font-size: 14px;
      text-shadow: 1px 1px 1px #000;
      display: inline-block;
      text-align: center;
      position: relative;

      .name_map {
        height: 17px;
        /* position: absolute; */
        cursor: default;
      }
    }
    .left_footer {
      display: inline-block;
      vertical-align: top;
      .hp {
        width: 126px;
        height: 20px;
        display: inline-block;
        position: relative;
        .progress_bar {
          background-image: url("/static/imgs/hp.png");
          background-repeat: no-repeat;
          position: absolute;
          width: 126px;
          height: 20px;
        }
        .num {
          position: absolute;
          width: 126px;
          height: 20px;
          color: #aa967f;
          font-family: "Doppio One", sans-serif;
          font-size: 11px;
          text-shadow: 1px 1px 1px #000;
          top: 2px;
          text-align: center;
          cursor: default;
        }
      }
      .mana {
        width: 126px;
        height: 20px;
        display: inline-block;
        position: relative;
        .progress_bar {
          background-image: url("/static/imgs/mana.png");
          background-repeat: no-repeat;
          position: absolute;
          width: 126px;
          height: 20px;
        }
        .num {
          position: absolute;
          width: 126px;
          height: 20px;
          color: #aa967f;
          font-family: "Doppio One", sans-serif;
          font-size: 11px;
          text-shadow: 1px 1px 1px #000;
          top: 2px;
          text-align: center;
          cursor: default;
        }
      }
      .gold {
        color: #aa967f;
        font-family: "Doppio One", sans-serif;
        font-size: 14px;
        width: 100px;
        height: 17px;
        cursor: default;
      }
      .attr {
        height: 35px;
        font-size: 0;
        .agilidad {
          color: #aa967f;
          font-family: "Doppio One", sans-serif;
          font-size: 14px;
          display: inline-block;
          cursor: default;
        }
        .fuerza {
          color: #aa967f;
          font-family: "Doppio One", sans-serif;
          font-size: 14px;
          display: inline-block;
          cursor: default;
        }
      }
    }
    .right_footer {
      display: inline-block;
      vertical-align: top;

      .minimap {
        width: 100px;
        height: 100px;
        display: inline-block;
        vertical-align: top;
        background-size: 100%;
        .point_minimap {
          width: 3px;
          height: 3px;
          background-color: #f00;
          position: relative;
        }
      }
      .buttons_map {
        display: inline-block;
        vertical-align: top;
        width: 100px;
        height: 45px;
        .open_map {
          cursor: pointer;
          width: 45px;
          height: 45px;
        }
      }
    }
  }
}
</style>
