import { useSnapshot } from "valtio";
import { UIStore } from "@/store/ui.store";
import style from "@/styles/Play.module.scss";

type TProps = {
    handleSelectSpell: (idSpell: number) => void;
}

const Spells = ({ handleSelectSpell }: TProps) => {
    const uiStore = useSnapshot(UIStore);

    const renderBoxSpells = () => {
        const spells = uiStore.user.spells || {};

        let html = [];

        for (let i = 1; i < 29; i++) {
            const spell = spells[i];

            html.push(
                <div
                    className={style.slot_spell}
                    key={i}
                    onClick={() => handleSelectSpell(i)}
                >
                    <div
                        className={style.img_spell}
                        style={{
                            backgroundImage: spell
                                ? `url("/static/spells/${spell.idSpell}.png")`
                                : "none"
                        }}
                    />
                </div>
            );
        }

        return html;
    };

    return <>
        {renderBoxSpells()}
    </>;
};

export default Spells;
