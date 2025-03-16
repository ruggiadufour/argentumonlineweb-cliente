import { useSnapshot } from "valtio";
import _ from "lodash";
import { UIStore } from "@/store/ui.store";
import Inventary from "@/components/play/Inventary";
import Spells from "@/components/play/Spells";
import { Config } from "@/engine";
import style from "@/styles/Play.module.scss";

type TProps = {
    handleCharKeyCodeDefault: () => void;
    handleSelectSpell: (idSpell: number) => void;
    handleUseItem: (i: number) => void;
    config: React.RefObject<Config>;
    graphics: any;
}

export const PlayerPannel = ({
    handleCharKeyCodeDefault,
    handleSelectSpell,
    handleUseItem,
    config,
    graphics
}: TProps) => {
    const uiStore = useSnapshot(UIStore);

    
    return (
       
    )
}

export default PlayerPannel;