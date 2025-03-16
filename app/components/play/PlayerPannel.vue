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
    ? `Mapa: ${config.mapNumber} X: ${uiStore.ui.user.pos.x} Y: ${uiStore.ui.user.pos.y}`
    : "";
});

const handleShowInventary = () => {
  uiStore.ui.showInventary = true;
};

const handleShowSpells = () => {
  uiStore.ui.showInventary = false;
};

const handleSelectItem = (i: number) => {
  uiStore.ui.itemSelected = i;
};

const handleShowConfiguration = () => {
  uiStore.ui.showModalControlPanel = true;
  uiStore.ui.tmpKeyCodeDefault = _.cloneDeep(uiStore.ui.keyCodeDefault);
  emit('onCharKeyCodeDefault');
};
</script>

<template>
  <div class="content_right">
    <div class="header">
      <div class="level">{{ uiStore.ui.user.level }}</div>
    </div>
    <div class="configuration" @click="handleShowConfiguration" />
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
      <div
        class="button_inv"
        :class="{
          buttonInvSelected: !uiStore.ui.showInventary,
        }"
        @click="handleShowInventary"
      />
      <div
        class="button_spell"
        :class="{
          buttonSpellSelected: uiStore.ui.showInventary,
        }"
        @click="handleShowSpells"
      />
    </div>
    <div class="body">
      <div v-show="uiStore.ui.showInventary" class="inventary">
        <Inventary
          :graphics="graphics"
          :handleSelectItem="handleSelectItem"
          @on-use-item="emit('onUseItem', $event)"
        />
      </div>
      <div v-show="!uiStore.ui.showInventary" class="spell">
        <Spells @on-select-spell="emit('onSelectSpell', $event)" />
      </div>
    </div>
    <div class="footer">
      <div class="info_map">
        <div class="name_map">
          {{ uiStore.ui.nameMap }}
        </div>
        <div class="pos_map">
          {{ mapInfo }}
        </div>
      </div>
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
            className="{style.progress_bar}"
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
  width: 383px;
  height: 659px;
  display: inline-block;
  .header {
    width: 383px;
    height: 230px;
    font-size: 0;
    display: inline-block;
    vertical-align: top;
    .level {
      text-align: center;
      width: 60px;
      height: 20px;
      color: #aa967f;
      font-family: "Doppio One", sans-serif;
      font-size: 16px;
      margin-left: 160px;
      margin-top: 23px;
      display: inline-block;
      vertical-align: top;
      cursor: default;
    }
    .configuration {
      width: 40px;
      height: 40px;
      display: inline-block;
      margin-left: 110px;
      margin-top: 20px;
      cursor: pointer;
    }
    .name {
      width: 383px;
      height: 30px;
      color: #aa967f;
      font-family: "Doppio One", sans-serif;
      font-size: 24px;
      text-align: center;
      margin-top: 7px;
      cursor: default;
    }
    .exp {
      width: 203px;
      margin-top: 3px;
      height: 22px;
      margin-left: 92px;
      position: relative;
      .progress_bar {
        position: absolute;
        width: 203px;
        height: 22px;
        background-image: url("/static/imgs/fullXP.png");
        background-repeat: no-repeat;
        background-position: -20px -17px;
        max-width: 203px;
      }
      .porcentaje {
        position: absolute;
        width: 203px;
        height: 22px;
        color: #aa967f;
        font-family: "Doppio One", sans-serif;
        font-size: 12px;
        text-align: center;
        margin-top: 3px;
        text-shadow: 1px 1px 1px #000;
        cursor: default;
      }
      .num {
        display: none;
        position: absolute;
        width: 203px;
        height: 22px;
        color: #aa967f;
        font-family: "Doppio One", sans-serif;
        font-size: 12px;
        text-align: center;
        margin-top: 3px;
        text-shadow: 1px 1px 1px #000;
        cursor: default;
      }
    }
    .buttons {
      width: 383px;
      height: 108px;
      font-size: 0;
      .button_inv {
        width: 103px;
        height: 108px;
        background-repeat: no-repeat;
        margin-top: 10px;
        margin-left: 63px;
        display: inline-block;
        cursor: pointer;
      }
      .button_spell {
        width: 103px;
        height: 108px;
        background-repeat: no-repeat;
        background-position-x: -103px;
        margin-top: 10px;
        margin-left: 51px;
        display: inline-block;
        cursor: pointer;
      }
      .buttonInvSelected {
        background-image: url("/static/imgs/invyhechi.png");
      }
      .buttonSpellSelected {
        background-image: url("/static/imgs/invyhechi.png");
      }
    }
  }
  .body {
    width: 383px;
    height: 200px;
    display: inline-block;
    vertical-align: top;
    .inventary {
      margin-top: 50px;
      margin-left: 45px;
      width: 295px;
      font-size: 0;
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
    }
    .spell {
      display: none;
      margin-top: 45px;
      margin-left: 43px;
      width: 300px;
      height: 134px;
      overflow-y: scroll;
      font-size: 0;
    }
    .last_slot_spell {
      margin-right: 0;
    }
  }
  .footer {
    width: 383px;
    height: 229px;
    display: inline-block;
    vertical-align: top;
    font-size: 0;
    height: 192px;
    .info_map {
      color: #aa967f;
      font-family: "Doppio One", sans-serif;
      font-size: 14px;
      text-shadow: 1px 1px 1px #000;
      display: inline-block;
      width: 300px;
      height: 17px;
      margin-left: 40px;
      margin-top: 20px;
      text-align: center;
      position: relative;
      .name_map {
        width: 300px;
        height: 17px;
        position: absolute;
        cursor: default;
      }
      .pos_map {
        display: none;
        width: 300px;
        height: 17px;
        position: absolute;
        cursor: default;
      }
    }
    .left_footer {
      display: inline-block;
      vertical-align: top;
      width: 220px;
      height: 192px;
      .hp {
        width: 126px;
        height: 20px;
        margin-top: 15px;
        margin-left: 83px;
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
        margin-top: 29px;
        margin-left: 82px;
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
        margin-top: 21px;
        margin-left: 78px;
        cursor: default;
      }
      .attr {
        width: 220px;
        height: 35px;
        font-size: 0;
        .agilidad {
          color: #aa967f;
          font-family: "Doppio One", sans-serif;
          font-size: 14px;
          margin-top: 13px;
          margin-left: 78px;
          display: inline-block;
          cursor: default;
        }
        .fuerza {
          color: #aa967f;
          font-family: "Doppio One", sans-serif;
          font-size: 14px;
          margin-top: 13px;
          margin-left: 40px;
          display: inline-block;
          cursor: default;
        }
      }
    }
    .right_footer {
      display: inline-block;
      vertical-align: top;
      width: 163px;
      height: 192px;
      .minimap {
        width: 100px;
        height: 100px;
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        margin-left: 12px;
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
        margin-left: 12px;
        .open_map {
          cursor: pointer;
          margin-left: 29px;
          width: 45px;
          height: 45px;
        }
      }
    }
  }
}
</style>
