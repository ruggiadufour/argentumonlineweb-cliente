import { useRef } from "react";
import { useSnapshot } from "valtio";
import { UIStore } from "@/store/ui.store";
import { UI } from "@/engine";
import { AMOUNT_SLOTS_MACROS } from "@/utils/constants";
import style from "@/styles/Play.module.scss";

type TProps = {
  modalMacro: React.RefObject<HTMLDivElement>;
  ui: React.RefObject<UI>;
};

const Macros = ({ modalMacro, ui }: TProps) => {
  const uiStore = useSnapshot(UIStore);
  const macros = useRef([]);

  const renderBoxMacros = () => {
    let html = [];

    for (let i = 0; i < AMOUNT_SLOTS_MACROS; i++) {
      const macro = uiStore.valueKeyMacro[i];

      html.push(
        <div
          key={i}
          className={style.macro}
          onContextMenu={(e) => handleShowMacroConfig(e, i)}
          ref={(ref) => {
            macros[i] = ref;
          }}
        >
          {macro.idPosItem !== "" && macro.img ? (
            <div
              className={style.item}
              style={{
                backgroundImage: `url("${macro.img}")`,
              }}
            />
          ) : null}

          {macro.idSpell !== -1 && macro.img ? (
            <div
              className={style.spell}
              style={{
                backgroundImage: `url("${macro.img}")`,
              }}
            />
          ) : null}

          {macro.keyChar !== "" ? (
            <div className={style.key}>{macro.keyChar}</div>
          ) : null}
        </div>
      );
    }

    return html;
  };

  const handleShowMacroConfig = (e, key: number) => {
    e.preventDefault();

    const refMacro = macros[key];

    modalMacro.current.style.left = `${refMacro.offsetLeft - 57}px`;
    modalMacro.current.style.top = `${refMacro.offsetTop - 210}px`;

    UIStore.keyMacro.indexMacro = key;
    UIStore.keyMacro.idPosItem = "";
    UIStore.keyMacro.idPosSpell = -1;
    UIStore.keyMacro.idSpell = -1;
    UIStore.keyMacro.key = "";
    UIStore.keyMacro.keyChar = "";

    ui.current.setProperties({
      showMacroConfig: true,
      keyMacro: UIStore.keyMacro,
    });
  };

  return <>{renderBoxMacros()}</>;
};

export default Macros;
