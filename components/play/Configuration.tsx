import { useSnapshot } from "valtio";
import _ from "lodash";
import { TNameKeyCode } from "@/types";
import { Config } from "@/engine";
import { UI } from "@/engine";
import { UIStore } from "@/store/ui.store";
import { generateKeyMacro } from "@/utils/genereators";
import style from "@/styles/Play.module.scss";

type TProps = {
  handleCharKeyCodeDefault: () => void;
  ui: React.RefObject<UI>;
  config: React.RefObject<Config>;
};

const Configuration = ({ handleCharKeyCodeDefault, ui, config }: TProps) => {
  const uiStore = useSnapshot(UIStore);

  const handleHideModalControlPanel = () => {
    UIStore.showModalControlPanel = false;
  };

  const handleKeyDefault = (
    e: React.KeyboardEvent<HTMLInputElement>,
    keyType: number
  ) => {
    const keyCode = e.keyCode;

    if (
      Object.values(UIStore.tmpKeyCodeDefault).indexOf(keyCode) > -1 ||
      !isNaN(parseInt(UIStore.keyCodeMacros[keyCode]))
    ) {
      alert("La tecla ya está asignada");
    } else {
      let fromChar = String.fromCharCode(keyCode);

      if (config.current.keyCodeMap[keyCode]) {
        fromChar = config.current.keyCodeMap[keyCode];
      }

      UIStore.tmpKeyCodeDefault[keyType] = keyCode;
      uiStore.charKeyCodeDefault[keyType] = fromChar;
    }

    ui.current.setProperties({
      charKeyCodeDefault: uiStore.charKeyCodeDefault,
      tmpKeyCodeDefault: UIStore.tmpKeyCodeDefault,
    });
  };

  const restoreDefaultKeys = async () => {
    const { keyCodeDefaultReset } = uiStore;

    window.localStorage.setItem(
      "defaultKeys",
      JSON.stringify(keyCodeDefaultReset)
    );

    ui.current.setProperties({
      keyCodeDefault: _.cloneDeep(keyCodeDefaultReset),
      tmpKeyCodeDefault: _.cloneDeep(keyCodeDefaultReset)
    //   keyCodeDefault: structuredClone(keyCodeDefaultReset),
    //   tmpKeyCodeDefault: structuredClone(keyCodeDefaultReset),
    });

    handleCharKeyCodeDefault();
  };

  const saveChangesKeys = () => {
    const { tmpKeyCodeDefault } = uiStore;

    window.localStorage.setItem(
      "defaultKeys",
      JSON.stringify(tmpKeyCodeDefault)
    );

    ui.current.setProperty(
      "keyCodeDefault",
      //   structuredClone(tmpKeyCodeDefault)
      _.cloneDeep(tmpKeyCodeDefault)
    );

    alert("Teclas guardadas.");
  };

  const restoreMacros = () => {
    window.localStorage.setItem("macros", "");

    ui.current.setProperties({
      keyCodeMacros: {},
      valueKeyMacro: [
        generateKeyMacro(),
        generateKeyMacro(),
        generateKeyMacro(),
        generateKeyMacro(),
        generateKeyMacro(),
        generateKeyMacro(),
      ],
    });

    alert("Macros reseteados.");
  };

  return (
    <div
      className={style.modalControlPanel}
      style={{
        display: uiStore.showModalControlPanel ? "block" : "none",
      }}
    >
      <div
        className={style.closeControlPanel}
        onClick={handleHideModalControlPanel}
      />
      <div className={style.sound} />
      <div className={style.teclas}>
        <input
          type="text"
          className={`${style.tecla} ${style.margin_left_tecla}`}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.flechaArriba]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.flechaArriba);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.flechaAbajo]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.flechaAbajo);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.flechaIzquierda]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.flechaIzquierda);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.flechaDerecha]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.flechaDerecha);
          }}
          onChange={() => {}}
        />

        <input
          type="text"
          className={`${style.tecla} ${style.margin_left_tecla}`}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.usar]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.usar);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.atacar]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.atacar);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.agarrar]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.agarrar);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.tirar]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.tirar);
          }}
          onChange={() => {}}
        />

        <input
          type="text"
          className={`${style.tecla} ${style.margin_left_tecla}`}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.equipar]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.equipar);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.domar]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.domar);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.robar]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.robar);
          }}
          onChange={() => {}}
        />
        <input
          type="text"
          className={style.tecla}
          value={uiStore.charKeyCodeDefault[TNameKeyCode.seguro]}
          onKeyUp={(e) => {
            handleKeyDefault(e, TNameKeyCode.seguro);
          }}
          onChange={() => {}}
        />

        <div className={style.default_teclas} onClick={restoreDefaultKeys} />
        <div className={style.save_cambios} onClick={saveChangesKeys} />
        <div className={style.reset_macros} onClick={restoreMacros} />
      </div>
    </div>
  );
};

export default Configuration;
