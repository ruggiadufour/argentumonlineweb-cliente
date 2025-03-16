<script setup lang="ts">
import { useUIStore } from "@/store/ui.store";
import type { TItemTrade } from "@/types";

defineProps<{}>();
const emit = defineEmits<{
  (e: "onBuyTrade"): void;
  (e: "onSellTrade"): void;
}>();

const uiStore = useUIStore();

const handleCloseModalTrade = () => {
  uiStore.ui.showModalTrade = false;
};

const boxItemsTrade = computed(() => {
  const boxes = [];
  for (let i = 1; i < 26; i++) {
    const item = uiStore.ui.trade.itemsTrade[i];
    boxes.push(item);
  }
  return boxes;
});

const boxItemsUserTrade = computed(() => {
  const boxes = [];
  for (let i = 1; i < 26; i++) {
    const item = uiStore.ui.trade.itemsUser[i];
    boxes.push(item);
  }
  return boxes;
});

const handleSelectItemUserTrade = (i: number) => {
  const item = uiStore.ui.trade.itemsUser[i];
  uiStore.ui.trade.idPosInv = i;
  handleSelectItem(item);
};

const handleSelectItemTrade = (i: number) => {
  const item = uiStore.ui.trade.itemsTrade[i];
  uiStore.ui.trade.idPosTrade = i;
  handleSelectItem(item);
};

const handleSelectItem = (item: TItemTrade | undefined) => {
  if (item) {
    uiStore.ui.trade.titleItem = item.name;
    uiStore.ui.trade.infoItem = item.info;
    uiStore.ui.trade.imgItem = item.imgItem;
    uiStore.ui.trade.goldItem = item.gold;
  } else {
    uiStore.ui.trade.titleItem = "";
    uiStore.ui.trade.infoItem = "";
    uiStore.ui.trade.imgItem = "";
    uiStore.ui.trade.goldItem = 0;
  }
};
</script>

<template>
  <div v-show="uiStore.ui.showModalTrade" class="modalTrade">
    <div class="headTrade">
      <div class="imgItemTrade">
        <div
          class="imgItem"
          :style="{
            backgroundImage: uiStore.ui.trade.imgItem
              ? `url('${uiStore.ui.trade.imgItem}')`
              : 'none',
          }"
        />
      </div>
      <div class="titleAndGold">
        <div class="titleItemTrade">
          {{ uiStore.ui.trade.titleItem }}
        </div>
        <div class="infoItem">
          {{ uiStore.ui.trade.infoItem }}
        </div>
        <div class="goldItemTrade">
          {{ uiStore.ui.trade.goldItem }}
        </div>
      </div>
      <div class="closeTrade" @click="handleCloseModalTrade" />
    </div>
    <div class="itemsTrade">
      <div class="trade">
        <div
          v-for="(item, i) of boxItemsTrade"
          :key="i"
          :class="[
            'slotTrade',
            item && !item?.validUser ? 'itemNotValid' : '',
            uiStore.ui.trade.idPosTrade === i ? 'slotTradeSelected' : '',
          ]"
          @click="handleSelectItemTrade(i)"
        >
          <div
            v-if="item"
            className="{style.imgItem}"
            :style="{
              backgroundImage: item ? `url('${item.imgItem}')` : 'none',
            }"
          />
        </div>
      </div>
      <div class="inventary">
        <div
          v-for="(item, i) of boxItemsUserTrade"
          :key="i"
          :class="[
            'slotInventary',
            uiStore.ui.trade.idPosInv === i ? 'slotInventarySelected' : '',
          ]"
          @click="handleSelectItemUserTrade(i)"
        >
          <div
            :class="['imgItem', item && !item.validUser ? 'itemNotValid' : '']"
            :style="{
              backgroundImage: item ? `url('${item?.imgItem}')` : 'none',
            }"
          />
          <div class="cant">{{ item && item.cant }}</div>
          <div v-if="item && item.equipped" class="equipped">E</div>
        </div>
      </div>
    </div>
    <div class="footerTrade">
      <div class="buttonBuy" @click="$emit('onBuyTrade')" />
      <div class="buttonLess" />
      <input type="text" class="cantTrade" v-model="uiStore.ui.cantTrade" />
      <div class="buttonMore" />
      <div class="buttonSell" @click="$emit('onSellTrade')" />
    </div>
  </div>
</template>

<style scoped>
.modalTrade {
  background-image: url("/static/imgs/trade.png");
  background-repeat: no-repeat;
  width: 467px;
  height: 415px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  font-family: "Doppio One", sans-serif;
  user-select: none;
  .headTrade {
    float: left;
    width: 100%;
    height: 100px;
    .imgItemTrade {
      float: left;
      width: 38px;
      height: 38px;
      margin-left: 47px;
      margin-top: 33px;
      .imgItem {
        width: 34px;
        height: 33px;
        margin-top: 3px;
        margin-left: 3px;
        position: absolute;
        z-index: 10;
        background-repeat: no-repeat;
      }
    }
    .titleAndGold {
      float: left;
      width: 350px;
      height: 100px;
      color: #fff;
      font-size: 14px;
      font-size: 12px;
      .titleItemTrade {
        float: left;
        width: 325px;
        height: 16px;
        margin-top: 33px;
        margin-left: 6px;
        font-size: 11px;
      }
      .infoItem {
        float: left;
        width: 245px;
        height: 16px;
        margin-top: 6px;
        margin-left: 6px;
      }
      .goldItemTrade {
        float: left;
        width: 80px;
        height: 20px;
        margin-left: 18px;
        margin-top: 4px;
      }
    }
    .closeTrade {
      float: right;
      width: 32px;
      height: 32px;
      cursor: pointer;
    }
  }
  .itemsTrade {
    float: left;
    width: 100%;
    height: 225px;
    .trade {
      float: left;
      width: 190px;
      margin-left: 29px;
      margin-top: 25px;
      .slotTrade {
        cursor: pointer;
        float: left;
        background-image: url("/static/imgs/slotTrade.png");
        background-repeat: no-repeat;
        width: 38px;
        height: 38px;
        .imgItem {
          width: 34px;
          height: 33px;
          margin-top: 3px;
          margin-left: 3px;
          position: absolute;
          z-index: 10;
          background-repeat: no-repeat;
        }
        .cant {
          width: 34px;
          height: 34px;
          margin-top: 1px;
          margin-left: 2px;
          position: absolute;
          z-index: 20;
          font-size: 10px;
          color: #fff;
        }
        .equipped {
          display: none;
          width: 10px;
          height: 15px;
          margin-top: 24px;
          margin-left: 28px;
          position: absolute;
          z-index: 20;
          font-size: 11px;
          color: #ff0;
        }
      }
      .slotTradeSelected {
        background-image: url("/static/imgs/itemSelected.png");
        background-repeat: no-repeat;
      }
      .itemNotValid {
        background-color: rgba(255, 0, 0, 0.2);
      }
    }
    .inventary {
      float: left;
      width: 190px;
      margin-left: 29px;
      margin-top: 25px;
      .slotInventary {
        cursor: pointer;
        float: left;
        background-image: url("/static/imgs/slotTrade.png");
        background-repeat: no-repeat;
        width: 38px;
        height: 38px;
        .imgItem {
          width: 32px;
          height: 32px;
          margin-top: 3px;
          margin-left: 3px;
          position: absolute;
          z-index: 10;
          background-repeat: no-repeat;
        }
        .cant {
          width: 34px;
          height: 34px;
          margin-top: 1px;
          margin-left: 2px;
          position: absolute;
          z-index: 20;
          font-size: 10px;
          color: #fff;
        }
        .equipped {
          width: 10px;
          height: 15px;
          margin-top: 24px;
          margin-left: 28px;
          position: absolute;
          z-index: 20;
          font-size: 11px;
          color: #ff0;
        }
      }
      .slotInventarySelected {
        background-image: url("/static/imgs/itemSelected.png");
        background-repeat: no-repeat;
      }
      .itemNotValid {
        background-color: rgba(255, 0, 0, 0.2);
      }
    }
  }
  .footerTrade {
    float: left;
    width: 100%;
    height: 55px;
    .buttonBuy {
      float: left;
      margin-left: 60px;
      margin-top: 21px;
      width: 118px;
      height: 35px;
      cursor: pointer;
    }
    .buttonLess,
    .buttonMore {
      float: left;
      margin-top: 21px;
      width: 25px;
      height: 35px;
      cursor: pointer;
    }
    .buttonSell {
      float: left;
      margin-top: 21px;
      width: 118px;
      height: 35px;
      cursor: pointer;
    }
    .cantTrade {
      background: transparent;
      border: none;
      float: left;
      width: 48px;
      height: 17px;
      margin-top: 31px;
      margin-left: 6px;
      text-align: center;
      color: #fff;
    }
  }
}
</style>
