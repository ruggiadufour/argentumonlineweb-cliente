import { proxy, useSnapshot } from "valtio";
import { User } from "@/engine";
import { UIStore } from "@/store/ui.store";
import style from "@/styles/Play.module.scss";

type TProps = {
  graphics: any;
  handleSelectItem: (i: number) => void;
  handleUseItem: (i: number) => void;
}

const Inventary = ({
  graphics,
  handleSelectItem,
  handleUseItem,
}: TProps) => {
  const uiStore = useSnapshot(UIStore);
  const state = proxy({
    lastClickIdItem: 0,
    clickUse: 0,
  });

  const getSlots = () => {
    const slots_ = [];
    for (let i = 1; i < 22; i++) {
      slots_.push(uiStore.user.items?.[i] || null);
    }
    return slots_ as (User["items"][string] | null)[];
  };

  const selectItem = (i) => {
    console.log(uiStore);
    
    handleSelectItem(i);

    if (uiStore.showMacroConfig) {
      const items = uiStore.user.items;
      const item = items[i];

      if (item) {
        UIStore.keyMacro.idSpell = -1;
        UIStore.keyMacro.idPosItem = i;
        UIStore.keyMacro.img = `/static/graficos/${
          graphics[item.grhIndex].numFile
        }.png`;
      }

      // ui.current.setProperty("keyMacro", currentKeyMacro);

      return;
    }

    if (state.clickUse > 1 && state.lastClickIdItem == i) {
      state.clickUse = 0;
      handleUseItem(i);
    }

    state.clickUse++;
    state.lastClickIdItem = i;
  };

  return (
    <div className="">
      {getSlots().map((item, i) => (
        <div
          className={`${style.slot_inv} ${
            uiStore.selectItem === i ? style.item_selected : ""
          }`}
          key={i}
          onClick={() => selectItem(i)}
        >
          <div
            className={`${style.img_item} ${
              item && !item.validUser ? style.itemNotValid : ""
            }`}
            style={{
              backgroundImage: item
                ? `url("/static/graficos/${
                    graphics[item.grhIndex].numFile
                  }.png")`
                : "none",
            }}
          />
          <div className={style.amount}>{item ? item.cant : ""}</div>

          {item && item.equipped ? (
            <div className={style.equipped}>E</div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Inventary;
