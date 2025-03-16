import { useSnapshot } from "valtio";
import { UIStore } from "@/store/ui.store";
import { Config, UI } from "@/engine";
import style from "@/styles/Play.module.scss";

type TProps = {
    modalMacro: HTMLDivElement;
    ui: UI;
    config: Config;
}

const ConfigurationMacro = ({
    modalMacro,
    ui,
    config
}: TProps) => {
    const uiStore = useSnapshot(UIStore);

    

    return (
      
    )
}

export default ConfigurationMacro;