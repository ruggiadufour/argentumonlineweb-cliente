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
        
      );
    }

    return html;
  };

  

  return <>{renderBoxMacros()}</>;
};

export default Macros;
