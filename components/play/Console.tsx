import style from "@/styles/Play.module.scss";
import { useSnapshot } from "valtio";
import { UIStore } from "@/store/ui.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export const Console = () => {
    const uiStore = useSnapshot(UIStore);

    const openConsole = () => {
        UIStore.showConsole = !uiStore.showConsole;
    };

    return (
        <>
            <div
                id="console"
                className={style.console}
                style={{
                    display: uiStore.showConsole
                        ? "block"
                        : "none"
                }}
            >
                {
                    uiStore.messagesConsole.map(message => (
                        <span
                            style={message.style}
                            key={message.id}
                            dangerouslySetInnerHTML={{ __html: message.message }}
                        />
                    ))
                }
            </div>
            <div
                className={style.openConsole}
                title="Abrir o cerrar consola"
                onClick={openConsole}
            >
                {/* <FontAwesomeIcon icon={faComment as any} /> */}
            </div>
        </>
    )
}

export default Console;