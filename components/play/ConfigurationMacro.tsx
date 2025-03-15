import { useSnapshot } from "valtio";
import { UIStore } from "@/store/ui.store";
import { Config, UI } from "@/engine";
import style from "@/styles/Play.module.scss";

type TProps = {
    modalMacro: React.RefObject<HTMLDivElement>;
    ui: React.RefObject<UI>;
    config: React.RefObject<Config>;
}

const ConfigurationMacro = ({
    modalMacro,
    ui,
    config
}: TProps) => {
    const uiStore = useSnapshot(UIStore);

    const handleKeyMacro = e => {
        const keyCode = e.keyCode;

        if (
            Object.values(uiStore.keyCodeDefault).indexOf(keyCode) > -1 ||
            !isNaN(parseInt(uiStore.keyCodeMacros[keyCode]))
        ) {
            UIStore.keyMacro.key = "";
            UIStore.keyMacro.keyChar = "";
            alert("La tecla ya está asignada");
        } else {
            let fromChar = String.fromCharCode(keyCode);

            if (config.current.keyCodeMap[keyCode]) {
                fromChar = config.current.keyCodeMap[keyCode];
            }

            UIStore.keyMacro.key = keyCode;
            UIStore.keyMacro.keyChar = fromChar;
        }

        ui.current.setProperty("keyMacro", UIStore.keyMacro);
    };

    const saveMacro = () => {
        UIStore.valueKeyMacro[UIStore.keyMacro.indexMacro] = {
            idPosItem: UIStore.keyMacro.idPosItem,
            idSpell: UIStore.keyMacro.idSpell,
            idPosSpell: UIStore.keyMacro.idPosSpell,
            img: UIStore.keyMacro.img,
            key: UIStore.keyMacro.key,
            keyChar: UIStore.keyMacro.keyChar,
            indexMacro: UIStore.keyMacro.indexMacro
        };

        UIStore.keyCodeMacros[UIStore.keyMacro.key] = UIStore.keyMacro.indexMacro;

        ui.current.setProperties({
            valueKeyMacro: UIStore.valueKeyMacro,
            keyCodeMacros: UIStore.keyCodeMacros,
            showMacroConfig: false
        });

        window.localStorage.setItem("macros", JSON.stringify(UIStore.valueKeyMacro));
    };

    return (
        <div
            className={style.modalMacro}
            style={{ display: uiStore.showMacroConfig ? "block" : "none" }}
            ref={ref => {
                modalMacro.current = ref;
            }}
        >
            <div
                className={`${style.cruz} ${style.closeMacro}`}
                onClick={() => {
                    ui.current.setProperty("showMacroConfig", false);
                }}
            />
            <input
                type="text"
                onKeyUp={handleKeyMacro}
                className={style.keyMacro}
                value={uiStore.keyMacro.keyChar}
                onChange={() => { }}
            />
            <div className={style.img}>
                {uiStore.keyMacro.idPosItem && uiStore.keyMacro.img ? (
                    <div
                        className={style.item}
                        style={{
                            backgroundImage: `url("${uiStore.keyMacro.img}")`
                        }}
                    />
                ) : null}

                {uiStore.keyMacro.idSpell && uiStore.keyMacro.img ? (
                    <div
                        className={style.spell}
                        style={{
                            backgroundImage: `url("${uiStore.keyMacro.img}")`
                        }}
                    />
                ) : null}
            </div>
            <div
                className={style.guardarMacro}
                onClick={saveMacro}
            />
        </div>
    )
}

export default ConfigurationMacro;