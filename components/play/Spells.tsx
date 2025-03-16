import { useSnapshot } from "valtio";
import { UIStore } from "@/store/ui.store";
import style from "@/styles/Play.module.scss";

type TProps = {
    handleSelectSpell: (idSpell: number) => void;
}

const Spells = ({ handleSelectSpell }: TProps) => {
    const uiStore = useSnapshot(UIStore);

    

        return html;
    };

    return <>
        {renderBoxSpells()}
    </>;
};

export default Spells;
