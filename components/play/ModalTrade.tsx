import { useSnapshot } from "valtio";
import { UI } from "@/engine";
import { UIStore } from "@/store/ui.store";
import { TItemTrade } from "@/types";
import style from "@/styles/Play.module.scss";

type TProps = {
    ui: React.RefObject<UI>;
    handleBuyTrade: () => void;
    handleSellTrade: () => void;
}

const ModalTrade = ({
    ui,
    handleBuyTrade,
    handleSellTrade
}: TProps) => {
    const uiStore = useSnapshot(UIStore);

    

    return (
        
    )
}

export default ModalTrade;